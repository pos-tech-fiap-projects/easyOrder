import express, { Request, Response } from 'express';
import { CategoriaRepositoryMock } from '../../../Output/Repository/Mock/CategoriaRepositoryMock';
import { ListarCategoriasUsecase } from '../../../../Core/Application/Usecase/Produtos/ListarCategoriasUsecase';


export class ListaCategoriasEndpoint {

    public constructor(
        private listaCategoriasUsecaseMock: CategoriaRepositoryMock
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: Request, res: Response): Promise<void> {

        /**
            #swagger.tags = ['Produtos']
            #swagger.path = '/produto/categoria/listar'
            #swagger.method = 'get'
            #swagger.summary = 'Listar todos as categorias'
            #swagger.description = 'Endpoint para listar todos as categorias cadastradas'
            #swagger.produces = ["application/json"]  
        */


        const listaCategoriasUsecase = new ListarCategoriasUsecase();

        try {
            const result = await listaCategoriasUsecase.execute(req.body);

            /**
                #swagger.response[200] = {
                description: 'Categorias listadas com sucesso',
                schema: {
                type: 'object',
                properties: {
                categorias: {
                type: 'array',
                items: {
                type: 'string',
                example: 'LANCHE'
                            },
                example: ['LANCHE', 
                     'BEBIDA', 
                     'SOBREMESA', 
                     'ACOMPANHAMENTO']
         }
       }
     }
   }
  */

            if (result.categorias.length > 0) {



                res.status(200).json(result);
            } else {
                res.status(404).json({ categorias: [], mensagem: 'Nenhum item foi encontrado.' });
            }
        } catch (error) {
            res.status(500).json({ categorias: [], mensagem: 'Ocorreu um erro ao listar as categorias.' });
        }
    }

}