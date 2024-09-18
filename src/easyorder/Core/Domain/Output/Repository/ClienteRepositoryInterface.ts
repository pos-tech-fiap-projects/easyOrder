import { ClienteEntity } from "../../Entity/ClienteEntity";
import { CpfValueObject } from "../../ValueObject/CpfValueObject";

export interface ClienteRepositoryInterface {
    listarClientes(): Promise<ClienteEntity[]>;
    adicionarCliente(cliente: ClienteEntity): Promise<boolean>;
    atualizarCliente(cliente: ClienteEntity, novoCliente: ClienteEntity): Promise<boolean>;
    removerCliente(cliente: ClienteEntity): Promise<boolean>;
    buscarClientePorCpf(cpf: CpfValueObject): Promise<ClienteEntity | undefined>;
}
