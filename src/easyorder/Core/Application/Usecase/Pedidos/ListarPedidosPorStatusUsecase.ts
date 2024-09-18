import { PedidoEntity } from "../../../Domain/Entity/PedidoEntity";
import { PedidoRepositoryInterface, PedidoRepositoryInterfaceFilter } from "../../../Domain/Output/Repository/PedidoRepositoryInterface";
import { StatusPedidoEnum, StatusPedidoValueObject } from "../../../Domain/ValueObject/StatusPedidoValueObject";

export class ListarPedidosPorStatusUsecaseResponse {
    private mensagem: string;
    private pedidos: PedidoEntity[];

    constructor(mensagem: string, pedidos: PedidoEntity[]) {
        this.mensagem = mensagem;
        this.pedidos = pedidos;
    }

    public getMensagem(): string {
        return this.mensagem;
    }

    public getPedidos(): PedidoEntity[] {
        return this.pedidos;
    }
}

export class ListarPedidosPorStatusUsecase {

    constructor(
        private readonly pedidoRepository: PedidoRepositoryInterface
    ) { }

    public async execute(
        pedidoStatus: StatusPedidoValueObject,
        filter: PedidoRepositoryInterfaceFilter,
    ): Promise<ListarPedidosPorStatusUsecaseResponse> {

        try {
            const pedidos = await this.pedidoRepository.listarPedidosPorStatus(pedidoStatus, filter);

            if (!pedidos) {
                throw new Error('Erro ao listar pedidos');
            }

            if (!pedidos.length) {
                return new ListarPedidosPorStatusUsecaseResponse('Nenhum pedido encontrado', []);
            }

            return new ListarPedidosPorStatusUsecaseResponse('Pedido listados com sucesso', pedidos);
        } catch (error: any) {
            return new ListarPedidosPorStatusUsecaseResponse(error.message, []);
        }
    }

}