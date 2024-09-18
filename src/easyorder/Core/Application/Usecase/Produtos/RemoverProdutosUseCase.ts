import { ProdutoRepositoryInterface } from "../../../Domain/Output/Repository/ProdutoRepositoryInterface";
import { RemoverProdutoUsecaseInput, RemoverProdutoUsecaseOutput } from "../../../Domain/Output/Repository/RemoverProdutoRepositoryInterface";

export class RemoverProdutoUsecase {
    private produtoRepository: ProdutoRepositoryInterface;

    constructor(produtoRepository: ProdutoRepositoryInterface) {
        this.produtoRepository = produtoRepository;
    }

    public async execute(input: RemoverProdutoUsecaseInput): Promise<RemoverProdutoUsecaseOutput> {
        try {

            const produtoExistente = await this.produtoRepository.buscarProdutoPorId(input.id);

            if (!produtoExistente) {
                return { sucesso: false, mensagem: 'O produto não foi encontrado.' };
            }


            await this.produtoRepository.removerPorId(input.id);

            return { sucesso: true };
        } catch (error) {

            console.error('Erro ao remover o produto:', error);
            return { sucesso: false, mensagem: 'Ocorreu um erro ao remover o produto.' };
        }
    }
}