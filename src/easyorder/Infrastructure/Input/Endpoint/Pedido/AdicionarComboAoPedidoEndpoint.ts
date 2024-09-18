
import { Request, Response } from 'express';
import { PedidoRepositoryInterface } from '../../../../Core/Domain/Output/Repository/PedidoRepositoryInterface';
import { AdicionarComboAoPedidoUsecase } from '../../../../Core/Application/Usecase/Pedidos/AdicionarComboAoPedidoUsecase';
import { ProdutoRepositoryInterface } from '../../../../Core/Domain/Output/Repository/ProdutoRepositoryInterface';
import { ConvertePedidoParaJsonFunction } from './ConvertePedidoParaJsonFunction';

export class AdicionarComboAoPedidoEndpointParam {
    public pedidoRepository: PedidoRepositoryInterface;
    public produtoRepository: ProdutoRepositoryInterface;

    constructor(pedidoRepository: PedidoRepositoryInterface, produtoRepository: ProdutoRepositoryInterface) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
    }
}

export class AdicionarComboAoPedidoEndpoint {

    public pedidoRepository: PedidoRepositoryInterface;
    public produtoRepository: ProdutoRepositoryInterface;

    constructor(
        param: AdicionarComboAoPedidoEndpointParam
    ) {
        this.pedidoRepository = param.pedidoRepository;
        this.produtoRepository = param.produtoRepository;

        this.handle = this.handle.bind(this);
    }

    public async handle(req: Request, res: Response): Promise<void> {
        /**
            #swagger.tags = ['Pedidos']
            #swagger.path = '/pedido/:pedidoId/combo'
            #swagger.method = 'post'
            #swagger.summary = 'Adicionar combo ao pedido'
            #swagger.description = 'Endpoint para adicionar um combo ao pedido. Não esqueça de adicionar um produto válido ao combo - você também pode consultar os produtos disponíveis.'
            #swagger.produces = ["application/json"]
            #swagger.parameters['pedidoId'] = {
                in: 'path',
                description: 'ID do pedido',
                required: true,
                type: 'string',
                example: '228ec10e-5675-47f4-ba1f-2c4932fe68cc'
            }
            #swagger.parameters['body'] = { 
                in: 'body', 
                '@schema': { 
                    "required": ["lancheId", "bebidaId", "sobremesaId", "acompanhamentoId"],
                    "properties": { 
                        "lancheId": { 
                            "type": "string",
                            "minLength": 36,
                            "maxLength": 36,
                            "format": "uuid",
                            "example": "29a81eeb-d16d-4d6c-a86c-e13597667307"
                        },
                        "bebidaId": { 
                            "type": "string",
                            "minLength": 36,
                            "maxLength": 36,
                            "format": "uuid",
                            "example": "29a81eeb-d16d-4d6c-a86c-e13597667307"
                        },
                        "sobremesaId": { 
                            "type": "string",
                            "minLength": 36,
                            "maxLength": 36,
                            "format": "uuid",
                            "example": "29a81eeb-d16d-4d6c-a86c-e13597667307"
                        },
                        "acompanhamentoId": { 
                            "type": "string",
                            "minLength": 36,
                            "maxLength": 36,
                            "format": "uuid",
                            "example": "29a81eeb-d16d-4d6c-a86c-e13597667307"
                        },
                    }
                }
            }
        */
        try {

            const usecase = new AdicionarComboAoPedidoUsecase(
                this.pedidoRepository,
                this.produtoRepository
            );

            if (req.body === undefined || Object.keys(req.body).length === 0) {
                throw new Error('Nenhum dado enviado.');
            }

            const pedidoId = req.params.pedidoId;

            const result = await usecase.execute(
                pedidoId,
                req.body.lancheId,
                req.body.bebidaId,
                req.body.sobremesaId,
                req.body.acompanhamentoId,
            );

            if (!result.getSucessoExecucao()) {
                throw new Error(result.getMensagem());
            }

            /**
            #swagger.responses[200] = {
                description: 'Combo adicionado ao pedido com sucesso',
                '@schema': {
                    'properties': {
                        mensagem: {
                            type: 'string',
                            example: 'Combo adicionado ao pedido com sucesso'
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