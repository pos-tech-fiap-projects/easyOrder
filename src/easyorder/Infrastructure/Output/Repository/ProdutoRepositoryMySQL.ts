
import { ProdutoEntity } from "../../../Core/Domain/Entity/ProdutoEntity";
import { ProdutoRepositoryInterface } from "../../../Core/Domain/Output/Repository/ProdutoRepositoryInterface";
import { CategoriaEnum } from "../../../Core/Domain/ValueObject/CategoriaEnum";
import { Sequelize, Model, DataTypes, where } from 'sequelize';

class LocalModel extends Model {
    public id!: string;
    public nome!: string;
    public descricao!: string;
    public preco!: number;
    public categoria!: string;
    public imagemURL!: string;

}


export class ProdutoRepositoryMySQL implements ProdutoRepositoryInterface {

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
            nome: {
                type: DataTypes.STRING,
            },
            descricao: {
                type: DataTypes.STRING,
            },
            preco: {
                type: DataTypes.DOUBLE,
            },
            categoria: {
                type: DataTypes.STRING,
            },
            imagemURL: {
                type: DataTypes.STRING,
            },
        }, {
            sequelize: this.sequelize,
            modelName: 'Produto',
            tableName: 'produtos',
            timestamps: false,
        });
        this.sequelize.sync({
            alter: true
        });


    }


    public async listarProdutos(): Promise<ProdutoEntity[]> {
        const produtos = await LocalModel.findAll();
        if (!produtos) {
            return [];
        }



        return produtos.map(produto => {
            return new ProdutoEntity(
                produto.nome,
                produto.descricao,
                produto.preco,
                produto.categoria as CategoriaEnum,
                produto.imagemURL,
                produto.id
            )
        });
    }
    public async listarProdutoCategoria(categoria: CategoriaEnum): Promise<ProdutoEntity[]> {

        return new Array<ProdutoEntity>();
    }
    public async buscarProdutoPorId(id: string): Promise<ProdutoEntity | undefined> {
        const produto = await LocalModel.findOne({
            where: {
                id: id
            }
        });
        if (!produto) {
            return undefined;
        }
        return new ProdutoEntity(
            produto.nome,
            produto.descricao,
            produto.preco,
            produto.categoria as CategoriaEnum,
            produto.imagemURL,
            produto.id

        )


    }
    public async removerPorId(idProduto: string): Promise<void> {
        await LocalModel.destroy({
            where: {
                id: idProduto
            }
        });
        return;
    }



    public async salvarProduto(cliente: ProdutoEntity): Promise<void> {

        const dto = {
            id: cliente.getId(),
            nome: cliente.getNome(),
            descricao: cliente.getDescricao(),
            preco: cliente.getPreco(),
            categoria: cliente.getCategoria(),
            imagemURL: cliente.getImagemURL(),
        }

        await LocalModel.upsert(dto);

        return;
    }

}