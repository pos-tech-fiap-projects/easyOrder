import express from 'express';
import { Request, Response } from 'express';
import { RemoverProdutoUsecase } from '../../../../Core/Application/Usecase/Produtos/RemoverProdutosUseCase';
import { ProdutoRepositoryInterface } from '../../../../Core/Domain/Output/Repository/ProdutoRepositoryInterface';

export class RemoverProdutoEndpoint {

    public constructor(private produtoRepository: ProdutoRepositoryInterface) {
        this.handle = this.handle.bind(this);
    }


    public async handle(req: Request, res: Response): Promise<void> {

        /**
            #swagger.tags = ['Produtos']
            #swagger.path = '/produto/remover/{id}'
            #swagger.method = 'delete'
            #swagger.summary = 'Remover produto'
            #swagger.description = 'Endpoint para remover um produto'
            #swagger.produces = ["application/json"]
            #swagger.parameters['id'] = {
                in: 'path',
                description: 'ID do produto',
                required: true,
                type: 'string',
                example: '228ec10e-5675-47f4-ba1f-2c4932fe68cc'
            }
            }
        */

        const removerProdutoUsecase = new RemoverProdutoUsecase(this.produtoRepository);

        const id = req.params.id as string;

        try {
            const result = await removerProdutoUsecase.execute({id});

            if (result.sucesso === true) {
                res.status(200).json({ sucesso: true, mensagem: `Produto com ID ${id} removido com sucesso.` });
            } else {
                res.status(400).json({ sucesso: false, mensagem: 'Erro na remoção do produto.' });
            }
        } catch (error) {
            res.status(500).json({ sucesso: false, mensagem: 'Ocorreu um erro inesperado.' });
        }
    }

}
