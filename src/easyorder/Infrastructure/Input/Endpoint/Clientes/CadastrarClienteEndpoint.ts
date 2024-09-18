import express from "express";
import { CadastrarClienteUsecase } from '../../../../Core/Application/Usecase/Clientes/CadastrarClienteUsecase';
import { ClienteRepositoryInterface } from "../../../../Core/Domain/Output/Repository/ClienteRepositoryInterface";

export class CadastrarClienteEndpoint {

    constructor(
        private clienteRepository: ClienteRepositoryInterface
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {

        /**
            #swagger.tags = ['Clientes']
            #swagger.path = '/cliente/cadastrar'
            #swagger.method = 'post'
            #swagger.summary = 'Cadastro de Novo Cliente'
            #swagger.description = 'Este endpoint é utilizado para realizar o Cadastro de um Novo Cliente, através dos dados fornecidos no corpo da requisição. Não é permitido o cadastro de mais de um cliente com o mesmo CPF.'
            #swagger.produces = ["application/json"]  
            #swagger.parameters['body'] = { 
                in: 'body', 
                '@schema': { 
                    "required": ["cpf", "nome", "email"], 
                    "properties": { 
                        "cpf": { 
                            "type": "string", 
                            "minLength": 11,
                            "maxLength": 11,
                            "example": "00000000000"
                        },
                        "nome": { 
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 255,
                            "example": "João da Silva"
                        },
                        "email": { 
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 255,
                            "example": "teste@teste.com"
                        }
                    }
                }
            }
        */

        const usecase = new CadastrarClienteUsecase(
            this.clienteRepository
        );


        try {

            if (req.body === undefined || Object.keys(req.body).length === 0) {
                throw new Error('Nenhum dado informado.');
            }

            const { cpf, nome, email } = req.body;

            const result = await usecase.execute(cpf, nome, email);

            /**
                #swagger.responses[200] = {
                    'description': 'Cliente cadastrado com sucesso',
                    '@schema': {
                        'properties': {
                            resultado_cadastro: {
                                type: 'boolean',
                                example: true
                            },
                            mensagem: {
                                type: 'string',
                                example: 'Cliente cadastrado com sucesso'
                            },
                            cliente: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string',
                                        example: '29a81eeb-d16d-4d6c-a86c-e13597667307'
                                    },
                                    nome: {
                                        type: 'string',
                                        example: 'João da Silva'
                                    },
                                    cpf: {
                                        type: 'string',
                                        example: '123.456.789-01'
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
            */

            res.json({
                resultado_cadastro: result.getSucessoCadastro(),
                mensagem: result.getMensagem(),
                cliente: result.getSucessoCadastro() ? {
                    id: result.getCliente()?.getId(),
                    nome: result.getCliente()?.getNome(),
                    cpf: result.getCliente()?.getCpf().getFormatado(),
                    email: result.getCliente()?.getEmail().getValue()
                } : null
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
                            example: 'Erro inesperado: Não foi possível cadastrar o cliente'
                        }
                    }
                }
            }
            */
            res.status(400).json({
                mensagem: error.message,
            });
            return;
        }

    }

}