
import { Request, Response } from 'express';
import { PedidoRepositoryInterface } from '../../../../Core/Domain/Output/Repository/PedidoRepositoryInterface';
import { FecharPedidoUsecase } from '../../../../Core/Application/Usecase/Pedidos/FecharPedidoUsecase';

export class FecharPedidoEndpoint {

    constructor(
        private pedidoRepository: PedidoRepositoryInterface
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: Request, res: Response): Promise<void> {
        /**
            #swagger.tags = ['Pedidos']
            #swagger.path = '/pedidos/fechar/{pedidoId}'
            #swagger.method = 'post'
            #swagger.summary = 'Fechar pedido'
            #swagger.description = 'Endpoint para fechar um pedido'
            #swagger.produces = ["application/json"]
            #swagger.parameters['pedidoId'] = {
                in: 'path',
                description: 'ID do pedido',
                required: true,
                type: 'string',
                example: '29a81eeb-d16d-4d6c-a86c-e13597667307'
            }
        */
        try {

            const usecase = new FecharPedidoUsecase(
                this.pedidoRepository
            );

            const pedidoId: string = req.params.pedidoId;

            if (!pedidoId) {
                throw new Error('Pedido não informado');
            }

            const result = await usecase.execute(pedidoId);

            if (!result.getSucessoExecucao()) {
                throw new Error(result.getMensagem());
            }

            /**
            #swagger.responses[200] = {
                'description': 'Pedido fechado com sucesso. Aguardando pagamento.',
                '@schema': {
                    'properties': {
                        mensagem: {
                            type: 'string',
                            example: 'Pedido fechado com sucesso. Aguardando pagamento.'
                        },
                        pedido: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    example: '29a81eeb-d16d-4d6c-a86c-e13597667307'
                                },
                                data: {
                                    type: 'string',
                                    example: '2021-10-10T15:00:00.000Z'
                                },
                                clienteId: {
                                    type: 'string',
                                    example: '29a81eeb-d16d-4d6c-a86c-e13597667307'
                                },
                                status: {
                                    type: 'string',
                                    example: 'RASCUNHO'
                                },
                                pagamentoStatus: {
                                    type: 'string',
                                    example: 'PENDENTE'
                                }
                            }
                        }
                    }
                }
            }
            */
            res.json({
                mensagem: result.getMensagem(),
                pedido: result.getPedido() ? {
                    id: result.getPedido()?.getId(),
                    data: result.getPedido()?.getDataPedido(),
                    clienteId: result.getPedido()?.getClienteId(),
                    status: result.getPedido()?.getStatusPedido().getValue(),
                    pagamentoStatus: result.getPedido()?.getStatusPagamento(),
                } : null
            });

        } catch (error: any) {
            /**
            #swagger.responses[400] = {
                'description': 'Ocorreu um erro inesperado',
                '@schema': {
                    'properties': {
                        mensagem: {
                            type: 'string',
                            example: 'Ocorreu um erro inesperado: Pedido não encontrado'
                        }
                    }
                }
            }
            */
            res.status(400).json({
                mensagem: 'Ocorreu um erro inesperado: ' + error.message,
            });
        }

        return;

    }

}