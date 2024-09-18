
import { Request, Response } from 'express';
import { PedidoRepositoryInterface } from '../../../../Core/Domain/Output/Repository/PedidoRepositoryInterface';
import { RemoverComboDoPedidoUsecase } from '../../../../Core/Application/Usecase/Pedidos/RemoverComboDoPedidoUsecase';
import { ConvertePedidoParaJsonFunction } from './ConvertePedidoParaJsonFunction';

export class RemoverComboDoPedidoEndpoint {

    constructor(
        private pedidoRepository: PedidoRepositoryInterface
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: Request, res: Response): Promise<void> {
        /**
            #swagger.tags = ['Pedidos']
            #swagger.path = '/pedido/:pedidoId/combo/:comboId'
            #swagger.method = 'delete'
            #swagger.summary = 'Remover combo do pedido'
            #swagger.description = 'Endpoint para remover um combo do pedido'
            #swagger.produces = ["application/json"]
            #swagger.parameters['pedidoId'] = {
                in: 'path',
                description: 'ID do pedido',
                required: true,
                type: 'string',
                example: '228ec10e-5675-47f4-ba1f-2c4932fe68cc'
            }
            #swagger.parameters['comboId'] = {
                in: 'path',
                description: 'ID do combo',
                required: true,
                type: 'string',
                example: '228ec10e-5675-47f4-ba1f-2c4932fe68cc'
            }
        */
        try {

            const usecase = new RemoverComboDoPedidoUsecase(
                this.pedidoRepository
            );

            const pedidoId = req.params.pedidoId;
            const comboId = req.params.comboId;

            const result = await usecase.execute(
                pedidoId,
                comboId,
            );

            if (!result.getSucessoExecucao()) {
                throw new Error(result.getMensagem());
            }

            /**
            #swagger.responses[200] = {
                description: 'Combo removido do pedido com sucesso',
                '@schema': {
                    'properties': {
                        mensagem: {
                            type: 'string',
                            example: 'Combo removido do pedido com sucesso'
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