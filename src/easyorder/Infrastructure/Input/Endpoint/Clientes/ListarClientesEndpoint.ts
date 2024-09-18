
import express from "express";
import { ListarClientesUsecase } from '../../../../Core/Application/Usecase/Clientes/ListarClientesUsecase';
import { ClienteRepositoryInterface } from "../../../../Core/Domain/Output/Repository/ClienteRepositoryInterface";

export class ListarClientesEndpoint {

    constructor(
        private clienteRepository: ClienteRepositoryInterface
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {

        /**
            #swagger.tags = ['Clientes']
            #swagger.path = '/cliente/listar'
            #swagger.method = 'get'
            #swagger.summary = 'Listar clientes'
            #swagger.description = 'Endpoint para listar todos os clientes cadastrados'
            #swagger.produces = ["application/json"]  
        */

        const usecase = new ListarClientesUsecase(
            this.clienteRepository
        );

        try {

            const result = await usecase.execute();

            /**
                #swagger.responses[200] = {
                    'description': 'Clientes listados com sucesso',
                    '@schema': {
                        properties: {
                            mensagem: {
                                type: 'string',
                                example: 'Clientes listados com sucesso'
                            },
                            clientes: {
                                type: 'array',
                                items: {
                                    properties: {
                                        id: {
                                            type: 'string',
                                            example: '1'
                                        },
                                        cpf: {
                                            type: 'string',
                                            example: '000.000.000-00'
                                        },
                                        nome: {
                                            type: 'string',
                                            example: 'Fulano de Tal'
                                        },
                                        email: {
                                            type: 'string',
                                            example: 'teste@teste.com'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            */
            res.json({
                mensagem: result.getMensagem(),
                clientes: result.getClientes()?.map(cliente => {
                    return ({
                        id: cliente.getId(),
                        cpf: cliente.getCpf().getFormatado(),
                        nome: cliente.getNome(),
                        email: cliente.getEmail().getValue()
                    })
                })
            });

        }
        catch (error: any) {
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
            console.log(error);
            res.status(400).json({
                mensagem: 'Ocorreu um erro inesperado: ' + error.message,
            });
            return;
        }

    }

}