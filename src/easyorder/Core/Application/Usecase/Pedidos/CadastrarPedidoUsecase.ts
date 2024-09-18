import { PedidoEntity } from "../../../Domain/Entity/PedidoEntity";
import { PedidoRepositoryInterface } from "../../../Domain/Output/Repository/PedidoRepositoryInterface";

export class CadastrarPedidoUsecaseResponse {
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

export class CadastrarPedidoUsecase {

    constructor(
        private readonly pedidoRepository: PedidoRepositoryInterface
    ) { }

    public async execute(cliente_identificado: boolean, clientId: string): Promise<CadastrarPedidoUsecaseResponse> {

        try {

            if (!cliente_identificado) {
                clientId = "NAO_IDENTIFICADO";
            }

            const pedido = new PedidoEntity(clientId);

            const pedidoSalvo = await this.pedidoRepository.salvarPedido(pedido)

            if (!pedidoSalvo) {
                throw new Error('Erro ao salvar pedido');
            }

            return new CadastrarPedidoUsecaseResponse(true, 'Pedido cadastrado com sucesso', pedidoSalvo);
        } catch (error: any) {
            return new CadastrarPedidoUsecaseResponse(false, error.message);
        }
    }

}