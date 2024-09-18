
import { Request, Response } from 'express';
import { StatusPedidoEnum, StatusPedidoValueObject } from '../../../../Core/Domain/ValueObject/StatusPedidoValueObject';
import { PedidoRepositoryInterface, PedidoRepositoryInterfaceFilterOrderDirection, PedidoRepositoryInterfaceFilterOrderField } from '../../../../Core/Domain/Output/Repository/PedidoRepositoryInterface';
import { BuscaPedidoPorIdUsecase } from '../../../../Core/Application/Usecase/Pedidos/BuscaPedidoPorIdUsecase';
import { ConvertePedidoParaJsonFunction } from './ConvertePedidoParaJsonFunction';

export class BuscaPedidoPorIdEndpoint {

    constructor(
        private pedidoRepository: PedidoRepositoryInterface
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: Request, res: Response): Promise<void> {
        /**
            #swagger.tags = ['Pedidos']
            #swagger.path = '/pedido/:pedidoId'
            #swagger.method = 'get'
            #swagger.summary = 'Buscar pedido por ID'
            #swagger.description = 'Endpoint para buscar um pedido por ID'
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

            const usecase = new BuscaPedidoPorIdUsecase(
                this.pedidoRepository
            );

            const result = await usecase.execute(
                req.params.pedidoId
            );

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
                    mensagem: 'Nenhum pedido encontrado'
                });
                return;
            }

            res.json({
                /**
                #swagger.responses[200] = {
                    description: 'Pedido Encontrado',
                    '@schema': {
                        'properties': {
                            mensagem: {
                                type: 'string',
                                example: 'Nenhum pedido encontrado'
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
