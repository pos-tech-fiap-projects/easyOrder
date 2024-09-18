
import { PedidoEntity } from "../../Entity/PedidoEntity";
import { StatusPedidoValueObject } from "../../ValueObject/StatusPedidoValueObject";

export enum PedidoRepositoryInterfaceFilterOrderField {
    DATA_CADASTRO = 'DATA_CADASTRO',
}

export enum PedidoRepositoryInterfaceFilterOrderDirection {
    ASC = 'ASC',
    DESC = 'DESC'
}

export class PedidoRepositoryInterfaceFilter {
    public page: number = 1;
    public limit: number = 10;
    public orderField: PedidoRepositoryInterfaceFilterOrderField = PedidoRepositoryInterfaceFilterOrderField.DATA_CADASTRO;
    public orderDirection: PedidoRepositoryInterfaceFilterOrderDirection = PedidoRepositoryInterfaceFilterOrderDirection.ASC;
}

export interface PedidoRepositoryInterface {
    salvarPedido(pedido: PedidoEntity): Promise<PedidoEntity | null>;
    listarPedidosPorStatus(status: StatusPedidoValueObject, filter: PedidoRepositoryInterfaceFilter): Promise<PedidoEntity[]>;
    buscaPedidoPorId(id: string): Promise<PedidoEntity | null>;
}
