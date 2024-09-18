import { PedidoEntity } from "../../../../Domain/Entity/PedidoEntity";
import { PedidoRepositoryInterface } from "../../../../Domain/Output/Repository/PedidoRepositoryInterface";
import { StatusPedidoEnum, StatusPedidoValueObject } from "../../../../Domain/ValueObject/StatusPedidoValueObject";

export class EntregarPedidoUsecaseResponse {
    private sucesso_execucao: boolean;
    private mensagem: string;
    private pedido: PedidoEntity | null = null;

    constructor(sucesso_execucao: boolean, mensagem: string, pedido?: PedidoEntity | null) {
        this.sucesso_execucao = sucesso_execucao;
        this.mensagem = mensagem;
        this.pedido = pedido || null;
    }

    public getSucessoExecucao(): boolean {
        return this.sucesso_execucao;
    }

    public getMensagem(): string {
        return this.mensagem;
    }

    public getPedido(): PedidoEntity | null {
        return this.pedido;
    }
}

export class EntregarPedidoUsecase {

    constructor(
        private readonly pedidoRepository: PedidoRepositoryInterface
    ) { }

    public async execute(pedidoId: string): Promise<EntregarPedidoUsecaseResponse> {

        try {
            const pedido = await this.pedidoRepository.buscaPedidoPorId(pedidoId);

            if (!pedido) {
                throw new Error('Pedido não encontrado');
            }

            pedido.setStatusPedido(new StatusPedidoValueObject(StatusPedidoEnum.FINALIZADO));

            const pedidoSalvo = await this.pedidoRepository.salvarPedido(pedido)

            if (!pedidoSalvo) {
                throw new Error('Erro ao salvar pedido');
            }

            return new EntregarPedidoUsecaseResponse(true, 'Pedido entregue com sucesso', pedidoSalvo);
        } catch (error: any) {
            return new EntregarPedidoUsecaseResponse(false, error.message);
        }
    }

}