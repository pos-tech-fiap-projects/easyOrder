import { ClienteEntity } from "../../../Core/Domain/Entity/ClienteEntity";
import { ClienteRepositoryInterface } from "../../../Core/Domain/Output/Repository/ClienteRepositoryInterface";
import { CpfValueObject } from "../../../Core/Domain/ValueObject/CpfValueObject";
import { EmailValueObject } from "../../../Core/Domain/ValueObject/EmailValueObject";
import { Sequelize, Model, DataTypes } from 'sequelize';

class LocalModel extends Model {
    public id!: string;
    public nome!: string;
    public cpf!: string;
    public email!: string;
}

export class ClienteRepositoryMySQL implements ClienteRepositoryInterface {

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
            cpf: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            }
        }, {
            sequelize: this.sequelize,
            modelName: 'Cliente',
            tableName: 'clientes',
            timestamps: false,
        });

        this.sequelize.sync({alter: true});

    }

    public async listarClientes(): Promise<ClienteEntity[]> {
        const clientes = await LocalModel.findAll();

        if (!clientes) {
            return [];
        }

        return clientes.map(cliente => {
            return new ClienteEntity(
                new CpfValueObject(cliente.cpf),
                cliente.nome,
                new EmailValueObject(cliente.email),
                cliente.id
            );
        });
    }

    public async buscarClientePorCpf(cpf: CpfValueObject): Promise<ClienteEntity | undefined> {
        const cliente = await LocalModel.findOne({
            where: {
                cpf: cpf.getValue()
            }
        });

        if (!cliente) {
            return undefined;
        }

        return new ClienteEntity(
            new CpfValueObject(cliente.cpf),
            cliente.nome,
            new EmailValueObject(cliente.email),
            cliente.id
        );
    }

    public async adicionarCliente(cliente: ClienteEntity): Promise<boolean> {

        const clienteData = {
            id: cliente.getId(),
            nome: cliente.getNome(),
            cpf: cliente.getCpf().getValue(),
            email: cliente.getEmail().getValue()
        };

        await LocalModel.upsert(clienteData);

        return true;
    }

    public async removerCliente(cliente: ClienteEntity): Promise<boolean> {
        await LocalModel.destroy({
            where: {
                cpf: cliente.getCpf().getValue()
            }
        });
        return true;
    }

    public async atualizarCliente(cliente: ClienteEntity, novoCliente: ClienteEntity): Promise<boolean> {
        await LocalModel.update({
            id: novoCliente.getId(),
            nome: novoCliente.getNome(),
            cpf: novoCliente.getCpf().getValue(),
            email: novoCliente.getEmail().getValue()
        }, {
            where: {
                cpf: cliente.getCpf().getValue()
            }
        });
        return true;
    }

}