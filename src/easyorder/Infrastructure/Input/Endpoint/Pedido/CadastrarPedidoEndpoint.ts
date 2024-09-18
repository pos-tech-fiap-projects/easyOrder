
import { Request, Response } from 'express';
import { CadastrarPedidoUsecase } from '../../../../Core/Application/Usecase/Pedidos/CadastrarPedidoUsecase';
import { PedidoRepositoryInterface } from '../../../../Core/Domain/Output/Repository/PedidoRepositoryInterface';
import { ConvertePedidoParaJsonFunction } from './ConvertePedidoParaJsonFunction';

export class CadastrarPedidoEndpoint {

    constructor(
        private pedidoRepository: PedidoRepositoryInterface
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: Request, res: Response): Promise<void> {
        /**
            #swagger.tags = ['Pedidos']
            #swagger.path = '/pedido'
            #swagger.method = 'post'
            #swagger.summary = 'Cadastrar novo pedido'
            #swagger.description = 'Endpoint para início de novo Pedido.' 
            #swagger.produces = ["application/json"]
            #swagger.parameters['body'] = { 
                in: 'body', 
                '@schema': { 
                    "properties": { 
                        "cliente_identificado": { 
                            "type": "boolean", 
                            "example": "true" 
                        },
                        "clienteId": { 
                            "type": "string", 
                            "minLength": 36, 
                            "maxLength": 36,
                            "format": "uuid",
                            "example": "29a81eeb-d16d-4d6c-a86c-e13597667307" 
                        }
                    }
                }
            }
        */
        try {

            const usecase = new CadastrarPedidoUsecase(
                this.pedidoRepository
            );

            if (req.body === undefined || Object.keys(req.body).length === 0) {
                throw new Error('Nenhum dado enviado.');
            }

            const cliente_identificado: boolean = req.body.cliente_identificado;
            const clienteId: string = req.body.clienteId;

            if (cliente_identificado) {

                if (!clienteId) {
                    throw new Error('Para identificar o Cliente, é obrigatório inserir o id.');
                }
    
            }
            
            const result = await usecase.execute(cliente_identificado, clienteId);

            if (!result.getSucessoExecucao()) {
                throw new Error(result.getMensagem());
            }

            /**
            #swagger.responses[200] = {
                'description': 'Pedido cadastrado com sucesso',
                '@schema': {
                    'properties': {
                        mensagem: {
                            type: 'string',
                            example: 'Pedido cadastrado com sucesso'
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
