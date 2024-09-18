
import { Request, Response } from 'express';
import { PedidoRepositoryInterface } from '../../../../../Core/Domain/Output/Repository/PedidoRepositoryInterface';
import { FinalizarPreparacaoPedidoUsecase } from '../../../../../Core/Application/Usecase/Preparacao/Pedido/FinalizarPreparacaoPedidoUsecase';
import { ConvertePedidoParaJsonFunction } from '../../Pedido/ConvertePedidoParaJsonFunction';

export class FinalizarPreparacaoPedidoEndpoint {

    constructor(
        private pedidoRepository: PedidoRepositoryInterface
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: Request, res: Response): Promise<void> {
        /**
            #swagger.tags = ['Preparação']
            #swagger.path = '/preparacao/pedido/:pedidoId/finalizar-preparacao'
            #swagger.method = 'put'
            #swagger.summary = 'Finalizar preparação de um pedido'
            #swagger.description = 'Endpoint para finalizar a preparação de um pedido'
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

            const usecase = new FinalizarPreparacaoPedidoUsecase(
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
                'description': 'Preparação do pedido finalizada com sucesso',
                '@schema': {
                    'properties': {
                        mensagem: {
                            type: 'string',
                            example: 'Preparação do pedido finalizada com sucesso'
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
