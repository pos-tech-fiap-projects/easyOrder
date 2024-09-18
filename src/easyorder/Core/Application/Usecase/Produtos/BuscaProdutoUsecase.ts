import { ProdutoEntity } from "../../../Domain/Entity/ProdutoEntity";
import { ProdutoRepositoryInterface } from "../../../Domain/Output/Repository/ProdutoRepositoryInterface";

export class BuscarProdutoPorIdUseCase {
    private produtoRepository: ProdutoRepositoryInterface;

    constructor(produtoRepository: ProdutoRepositoryInterface) {
        this.produtoRepository = produtoRepository;
    }

    public async execute(id: string): Promise<ProdutoEntity | null> {
        try {
            if (!id) {
                throw new Error("ID inválido");
            }


            const produto = await this.produtoRepository.buscarProdutoPorId(id);


            if (!produto) {
                return null;
            }


            return produto;
        } catch (error) {

            throw error;
        }
    }
}