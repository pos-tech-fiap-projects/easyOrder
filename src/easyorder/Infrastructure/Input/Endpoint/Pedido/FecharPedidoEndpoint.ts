
import { Request, Response } from 'express';
import { PedidoRepositoryInterface } from '../../../../Core/Domain/Output/Repository/PedidoRepositoryInterface';
import { FecharPedidoUsecase } from '../../../../Core/Application/Usecase/Pedidos/FecharPedidoUsecase';
import { ConvertePedidoParaJsonFunction } from './ConvertePedidoParaJsonFunction';

export class FecharPedidoEndpoint {

    constructor(
        private pedidoRepository: PedidoRepositoryInterface
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: Request, res: Response): Promise<void> {
        /**
            #swagger.tags = ['Pedidos']
            #swagger.path = '/pedido/:pedidoId/fechar'
            #swagger.method = 'put'
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
                            $ref: '#/definitions/Pedido'
                        }
                    }
                }
            }
            */
            res.json({
                mensagem: result.getMensagem(),
                pedido: ConvertePedidoParaJsonFunction(result.getPedido()),
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
