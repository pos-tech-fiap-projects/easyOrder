
import { Request, Response } from 'express';
import { PedidoRepositoryInterface } from '../../../../../Core/Domain/Output/Repository/PedidoRepositoryInterface';
import { BuscaProximoPedidoParaPreparacaoUsecase } from '../../../../../Core/Application/Usecase/Preparacao/Pedido/BuscaProximoPedidoParaPreparacaoUsecase';
import { ConvertePedidoParaJsonFunction } from '../../Pedido/ConvertePedidoParaJsonFunction';

export class BuscaProximoPedidoParaPreparacaoEndpoint {

    constructor(
        private pedidoRepository: PedidoRepositoryInterface
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: Request, res: Response): Promise<void> {
        /**
            #swagger.tags = ['Preparação']
            #swagger.path = '/preparacao/pedido/proximo'
            #swagger.method = 'get'
            #swagger.summary = 'Busca o próximo pedido para preparação'
            #swagger.description = 'Endpoint para buscar o próximo pedido para preparação'
            #swagger.produces = ["application/json"]
        */
        try {

            const usecase = new BuscaProximoPedidoParaPreparacaoUsecase(
                this.pedidoRepository
            );

            const result = await usecase.execute();

            if (!result) {
                throw new Error('Erro ao listar pedidos');
            }

            if (!result.getPedido()) {
                /**
                #swagger.responses[404] = {
                    'description': 'Nenhum pedido encontrado',
                    '@schema': {
                        'properties': {
                            mensagem: {
                                type: 'string',
                                example: 'Nenhum pedido encontrado'
                            }
                        }
                    }
                }
                */
                res.status(404).json({
                    mensagem: 'Nenhum pedido encontrado',
                    pedidos: []
                });
                return;
            }

            res.json({
                /**
                #swagger.responses[200] = {
                    'description': 'Pedido encontrado',
                    '@schema': {
                        'properties': {
                            mensagem: {
                                type: 'string',
                                example: 'Pedido encontrado'
                            },
                            pedido: {
                                $ref: '#/definitions/Pedido'
                            }
                        }
                    }
                }
                */
                mensagem: result.getMensagem(),
                pedido: ConvertePedidoParaJsonFunction(result.getPedido()),
            });
            return;

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

    }

}
