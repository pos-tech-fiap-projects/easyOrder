import express from "express";
import { ProdutoRepositoryInterface } from "../../../../Core/Domain/Output/Repository/ProdutoRepositoryInterface";
import { CadastrarProdutoUsecase } from "../../../../Core/Application/Usecase/Produtos/CadastrarProdutoUsecase";


export class CadastrarProdutoEndpoint {
    public constructor(
        private repository: ProdutoRepositoryInterface
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {

        /**
                #swagger.tags = ['Produtos']
                #swagger.path = '/produto/cadastrar'
                #swagger.method = 'post'
                #swagger.summary = 'Cadastro de Novo Produto'
                #swagger.description = 'Este endpoint é utilizado para realizar o Cadastro de um Novo Produto, através dos dados fornecidos no corpo da requisição.'
                #swagger.produces = ["application/json"]  
                #swagger.parameters['body'] = { 
                    in: 'body', 
                    '@schema': {  
                        "properties": { 
                            "nome": { 
                                "type": "string", 
                                "example": "X-Salada"
                            },
                            "descricao": { 
                                "type": "string",
                                "example": "sem salada, sem tomate"
                            },
                            "preco": { 
                                "type": "number",
                                "example": "25"
                            },
                            "imagemURL": {
                                "type": "string",
                                "example": "xsalada.png"
                            },
                            "categoria": {
                                "type": "string",
                                "example": "LANCHE"
                            }
                            }    
                            }     
    
                            }
                        }
                    }
                }
            */
        const usecase = new CadastrarProdutoUsecase(this.repository);

        if (req.body === undefined || Object.keys(req.body).length === 0) {
            res.status(400).json({
                resultado_cadastro: false,
                mensagem: 'Nenhum dado enviado.',
                produto: null
            });
            return;
        }

        // refatorar adicionando a logica de validação dos dados do request
        const { nome, descricao, preco, categoria, imagemURL } = req.body;
        const result = await usecase.execute(nome, descricao, preco, categoria, imagemURL);

                            /**
                                    #swagger.responses[200] = {
                                        'description': 'Produto cadastrado com sucesso',
                                        '@schema': {
                                            'properties': {
                                                resultado_cadastro: {
                                                    type: 'boolean',
                                                    example: true
                                                },
                                                mensagem: {
                                                    type: 'string',
                                                    example: 'Produto cadastrado com sucesso'
                                                },
                                                produto: {
                                                    type: 'object',
                                                    properties: {
                                                        "nome": { 
                                                        "type": "string", 
                                                        "example": "X-Salada"
                                                    },
                                                        "descricao": { 
                                                            "type": "string",
                                                            "example": "sem salada, sem tomate"
                                                        },
                                                        "preco": { 
                                                            "type": "number",
                                                            "example": "25"
                                                        },
                                                        "imagemURL": {
                                                            "type": "string",
                                                            "example": "xsalada.png"
                                                        },
                                                        "categoria": {
                                                            "type": "string",
                                                            "example": "LANCHE"
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
            produto: result.getSucessoCadastro() ? {
                id: result.getProduto()?.getId(),
                nome: result.getProduto()?.getNome(),
                descricao: result.getProduto()?.getDescricao(),
                preco: result.getProduto()?.getPreco(),
                categoria: result.getProduto()?.getCategoria(),
                imagem_url: result.getProduto()?.getImagemURL()
            } : null

            /**
            #swagger.responses[400] = {
                'description': 'Ocorreu um erro inesperado',
                '@schema': {
                    'properties': {
                        mensagem: {
                            type: 'string',
                            example: 'Erro inesperado: Não foi possivel cadastrar o produto'
                        }
                    }
                }
            }
            */
        });

    }

}