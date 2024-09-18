
import { PedidoEntity } from "../../../Core/Domain/Entity/PedidoEntity";
import { PedidoRepositoryInterface, PedidoRepositoryInterfaceFilter, PedidoRepositoryInterfaceFilterOrderDirection, PedidoRepositoryInterfaceFilterOrderField } from "../../../Core/Domain/Output/Repository/PedidoRepositoryInterface";
import { StatusPedidoEnum, StatusPedidoValueObject } from '../../../Core/Domain/ValueObject/StatusPedidoValueObject';
import { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { StatusPagamentoEnum } from '../../../Core/Domain/ValueObject/StatusPagamentoEnum';
import { PedidoComboEntity } from "../../../Core/Domain/Entity/PedidoComboEntity";
import { ProdutoEntity } from "../../../Core/Domain/Entity/ProdutoEntity";

class LocalModel extends Model {
    public id!: string;
    public dataPedido!: Date;
    public clienteId!: string;
    public statusPedido!: string;
    public statusPagamento!: string;
    public combos!: object[];
}

class PedidoRepositoryMySQL implements PedidoRepositoryInterface {

    private sequelize: Sequelize;

    constructor(
        private hostname: string,
        private portnumb: number,
        private database: string,
        private username: string,
        private password: string,
    ) {
        this.sequelize = new Sequelize(this.database, this.username, this.password, {
            host: this.hostname,
            port: this.portnumb,
            dialect: 'mysql',
        });

        LocalModel.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            dataPedido: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            clienteId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            statusPedido: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            statusPagamento: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            combos: {
                type: DataTypes.JSON,
                allowNull: true,
            },
        }, {
            sequelize: this.sequelize,
            modelName: 'Pedido',
            tableName: 'pedidos',
            timestamps: false,
        });

        this.sequelize.sync({ alter: true });
    }

    async salvarPedido(pedido: PedidoEntity): Promise<PedidoEntity | null> {
        const pedidoData = {
            id: pedido.getId(),
            dataPedido: pedido.getDataPedido(),
            clienteId: pedido.getClienteId(),
            statusPedido: pedido.getStatusPedido().getValue(),
            statusPagamento: pedido.getStatusPagamento(),
            combos: pedido.getCombos(),
        };

        await LocalModel.upsert(pedidoData);
        return pedido;
    }

    async listarPedidosPorStatus(status: StatusPedidoValueObject, filter: PedidoRepositoryInterfaceFilter): Promise<PedidoEntity[]> {
        let pedidosArray: PedidoEntity[] = [];

        const orderColumnReference = {
            [PedidoRepositoryInterfaceFilterOrderField.DATA_CADASTRO]: 'dataPedido',
        }

        await LocalModel.findAll({
            where: { statusPedido: status.getValue() },
            order: [[orderColumnReference[filter.orderField], filter.orderDirection]],
            limit: filter.limit,
            offset: (filter.page - 1) * filter.limit,
        }).then(pedidos => {

            if (!pedidos) {
                return [];
            }

            pedidosArray = pedidos.map(p => {
                const pedido = this.pedidoDBToEntity(p);
                return pedido;
            });
        });

        return pedidosArray;
    }

    async buscaPedidoPorId(id: string): Promise<PedidoEntity | null> {
        let pedidoEntity: PedidoEntity | null = null;
        await LocalModel.findByPk(id).then(pedido => {
            if (pedido) {
                pedidoEntity = this.pedidoDBToEntity(pedido);
            }
        });
        return pedidoEntity;
    }

    private pedidoDBToEntity(pedido: any): PedidoEntity {
        return new PedidoEntity(
            pedido.clienteId,
            pedido.dataPedido,
            new StatusPedidoValueObject(pedido.statusPedido as StatusPedidoEnum),
            pedido.statusPagamento as StatusPagamentoEnum,
            pedido.id,
            pedido.combos.map((combo: any) => {
                return new PedidoComboEntity(
                    combo.lanche ? new ProdutoEntity(
                        combo.lanche.nome,
                        combo.lanche.descricao,
                        combo.lanche.preco,
                        combo.lanche.categoria,
                        combo.lanche.imagemURL,
                        combo.lanche.id,
                    ) : null,
                    combo.bebida ? new ProdutoEntity(
                        combo.bebida.nome,
                        combo.bebida.descricao,
                        combo.bebida.preco,
                        combo.bebida.categoria,
                        combo.bebida.imagemURL,
                        combo.bebida.id,
                    ) : null,
                    combo.sobremesa ? new ProdutoEntity(
                        combo.sobremesa.nome,
                        combo.sobremesa.descricao,
                        combo.sobremesa.preco,
                        combo.sobremesa.categoria,
                        combo.sobremesa.imagemURL,
                        combo.sobremesa.id,
                    ) : null,
                    combo.acompanhamento ? new ProdutoEntity(
                        combo.acompanhamento.nome,
                        combo.acompanhamento.descricao,
                        combo.acompanhamento.preco,
                        combo.acompanhamento.categoria,
                        combo.acompanhamento.imagemURL,
                        combo.acompanhamento.id,
                    ) : null,
                    combo.id,
                );
            })
        );
    }
}

export { PedidoRepositoryMySQL };