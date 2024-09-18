import express, { Request, Response } from "express";
import { BuscarProdutoPorIdUseCase } from "../../../../Core/Application/Usecase/Produtos/BuscaProdutoUsecase";
import { ProdutoRepositoryInterface } from "../../../../Core/Domain/Output/Repository/ProdutoRepositoryInterface";

export class BuscarProdutoEndpoint {

    private buscarProdutoPorIdUseCase: BuscarProdutoPorIdUseCase;

    public constructor(produtoRepository: ProdutoRepositoryInterface) {
        this.buscarProdutoPorIdUseCase = new BuscarProdutoPorIdUseCase(produtoRepository);
        this.handle = this.handle.bind(this);
    }

    public async handle(req: express.Request, res: express.Response): Promise<void> {
        /**
            #swagger.summary = 'Buscar produto por ID.'
            #swagger.description = 'Endpoint para buscar um produto usando o ID.'
            #swagger.tags = ['Produtos']
            #swagger.path = '/produto/buscar/{id}'
            #swagger.method = 'get'
            #swagger.produces = ["application/json"]
            #swagger.parameters['id'] = {
                in: 'path',
                description: 'ID do produto',
                required: true,
                type: 'string',
                example: '5e73a938-41e7-4b76-a5a0-ae6147266e72'
            }
        */

        try {
            const id_produto: string = req.params.id;

            /**
                                    #swagger.responses[200] = {
                                        'description': 'Produto localizado:',
                                        '@schema': {
                                            'properties': {
                                                resultado_busca: {
                                                    type: 'boolean',
                                                    example: true
                                                },
                                                mensagem: {
                                                    type: 'string',
                                                    example: 'Produto localizado:'
                                                },
                                                produto: {
                                                    type: 'object',
                                                    properties: {
                                                        "id": { 
                                                        "type": "string", 
                                                        "example": "5e73a938-41e7-4b76-a5a0-ae6147266e72"
                                                    },
                                                        "nome": { 
                                                            "type": "string",
                                                            "example": "X-Bacon"
                                                        },
                                                        "preco": { 
                                                            "type": "number",
                                                            "example": "20"
                                                        },
                                                        "categoria": {
                                                            "type": "string",
                                                            "example": "Lanche"
                                                    }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                */


            if (!id_produto) {
                res.status(400).json({ mensagem: 'ID não informado', produto: null });
                return;
            }


            const produto = await this.buscarProdutoPorIdUseCase.execute(id_produto);


            if (produto) {
                res.status(200).json({
                    produto: {
                        id: produto.getId(),
                        nome: produto.getNome(),
                        preco: produto.getPreco(),
                        categoria: produto.getCategoria()
                    }
                });
            } else {

                /**
            #swagger.responses[404] = {
                'description': 'Produto não encontrado',
                '@schema': {
                    'properties': {
                    resultado_busca: {
                    type: 'boolean',
                    example: false
                    },
                        mensagem: {
                            type: 'string',
                            example: 'Produto não encontrado'
                        }
                                                    }
                    }
                }
            }
            */
                res.status(404).json({ mensagem: 'Produto não encontrado', produto: null });
            }
        } catch (error) {

            res.status(500).json({ mensagem: 'Erro interno do servidor', produto: null });
        }
    }
}