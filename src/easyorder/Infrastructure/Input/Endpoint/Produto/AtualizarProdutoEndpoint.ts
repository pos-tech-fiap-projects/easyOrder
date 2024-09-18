import express from "express";
import { ProdutoRepositoryInterface } from "../../../../Core/Domain/Output/Repository/ProdutoRepositoryInterface";
import { AtualizarProdutoUsecase } from "../../../../Core/Application/Usecase/Produtos/AtualizarProdutoUsecase";


export class AtualizarProdutoEndpoint {
    public constructor(
        private repository: ProdutoRepositoryInterface
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {

        /**
            #swagger.tags = ['Produtos']
            #swagger.path = '/produto/atualizar'
            #swagger.method = 'put'
            #swagger.summary = 'Atualização de Produto'
            #swagger.description = 'Este endpoint é utilizado para atualizar o Cadastro de um Produto, através dos dados fornecidos no corpo da requisição.'
            #swagger.produces = ["application/json"]  
            #swagger.parameters['body'] = { 
                in: 'body', 
                '@schema': {  
                    "properties": { 
                        "nome": { 
                            "type": "string", 
                            "example": "X-EGG"
                        },
                        "descricao": { 
                            "type": "string",
                            "example": "Sem cebola, sem tomate"
                        },
                        "preco": { 
                            "type": "number",
                            "example": "35"
                        },
                        "categoria": { 
                            "type": "string",
                            "example": "Lanche"
                        },
                        "imagemURL": { 
                            "type": "string",
                            "example": "x-egg.jpeg"
                        },
                        "id": { 
                            "type": "string",
                            "example": "0eb3a93d-df52-4f04-a463-389105328855"
                        }
                    }
                }
            }
        */
        const usecase = new AtualizarProdutoUsecase(this.repository);

        if (req.body === undefined || Object.keys(req.body).length === 0) {

            /**
            #swagger.responses[400] = {
                'description': 'Produto não encontrado',
                '@schema': {
                    'properties': {
                    resultado_cadastro: {
                            type: 'boolean',
                             example: false
                       },
                        mensagem: {
                            type: 'string',
                            example: 'Produto não encontrado, id inexistente'
                        }
                    }
                }
            }
            */

            res.status(400).json({
                resultado_cadastro: false,
                mensagem: 'Nenhum dado enviado.',
                produto: null
            });
            return;
        }

        const { nome, descricao, preco, categoria, imagemURL, id } = req.body;
        const result = await usecase.execute(nome, descricao, preco, categoria, imagemURL, id);

        /**
                                    #swagger.responses[200] = {
                                        'description': 'Produto atualizado com sucesso:',
                                        '@schema': {
                                            'properties': {
                                                resultado_cadastro: {
                                                    type: 'boolean',
                                                    example: true
                                                },
                                                mensagem: {
                                                    type: 'string',
                                                    example: 'Produto atualizado com sucesso:'
                                                },
                                                produto: {
                                                    type: 'object',
                                                    properties: {
                                                        "id": { 
                                                        "type": "string", 
                                                        "example": "0eb3a93d-df52-4f04-a463-389105328855"
                                                    },
                                                        "nome": { 
                                                            "type": "string",
                                                            "example": "X-EGG"
                                                        },
                                                        "descricao": { 
                                                            "type": "number",
                                                            "example": "Com maionese e muito cheedar"
                                                        },
                                                        "preco": { 
                                                            "type": "number",
                                                            "example": "30"
                                                        },
                                                        "categoria": {
                                                            "type": "string",
                                                            "example": "Lanche"
                                                    },
                                                    "imagem_url": {
                                                            "type": "string",
                                                            "example": "x-egg.jpeg"
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
        });

    }

}