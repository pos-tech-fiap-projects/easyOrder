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
            #swagger.summary = 'Atualização do produto'
            #swagger.description = 'Este endpoint é utilizado para atualizar o Cadastro de um Produto existente, através dos dados fornecidos no corpo da requisição. O id do produto é obrigatório e é usado para localizar o produto'
            #swagger.produces = ["application/json"]  
            #swagger.parameters['body'] = { 
                in: 'body', 
                '@schema': {  
                    "properties": {  
                        id: { 
                            type: "string", 
                            example: "178bd1b3-83f7-45cb-95cc-a354aa6b9bbe"
                        },
                        nome: { 
                            type: "string",
                            example: "Refrigerante"
                        },
                        descricao: { 
                            type: "string",
                            example: "Sabor Guaraná"
                        },
                        preco: {
                            type: "number",
                            example: 5.90
                        },
                        categoria: {
                            $ref: "#/definitions/CategoriaEnum",
                            examples: ["LANCHE", "BEBIDA", "SOBREMESA", "ACOMPANHAMENTO"]
                        },
                        imagemURL: {
                            type: "string",
                            example: "https://example.com/imagem.jpg"
                        }
                    }
                }
            }
         */
        const usecase = new AtualizarProdutoUsecase(this.repository);

        if (req.body === undefined || Object.keys(req.body).length === 0) {
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
                description: 'Sucesso na atualização do produto',
                schema: {
                    type: "object",
                    properties: {
                        resultado_cadastro: {
                            type: "boolean",
                            example: true
                        },
                        mensagem: {
                            type: "string",
                            example: "Produto atualizado com sucesso."
                        },
                        produto: {
                            $ref: "#/definitions/Produto"
                        }
                    }
                }
            }
            #swagger.responses[400] = {
                description: 'Erro na atualização do produto',
                schema: {
                    type: "object",
                    properties: {
                        resultado_cadastro: {
                            type: "boolean",
                            example: false
                        },
                        mensagem: {
                            type: "string",
                            example: "Algum dado está incorreto."
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