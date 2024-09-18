import { ListaCategoriasUsecaseInput, ListaCategoriasUsecaseOutput } from "../../../../Core/Domain/Output/Repository/CategoriaRepositoryInterface";
import { CategoriaEnum } from "../../../../Core/Domain/ValueObject/CategoriaEnum";



export class CategoriaRepositoryMock {

    private categorias: CategoriaEnum[] = Object.values(CategoriaEnum) as CategoriaEnum[];
    private simularVazio: boolean = true;

    public setSimularVazio(vazio: boolean): void {
        this.simularVazio = vazio;
    }

    public async execute(): Promise<ListaCategoriasUsecaseOutput> {
        try {

            if (this.categorias.length === 0) {
                return { categorias: [], mensagem: 'Nenhum item foi encontrado.' };
            }


            return { categorias: this.categorias };
        } catch (error) {

            return { categorias: [], mensagem: 'Ocorreu um erro ao listar as categorias.' };
        }
    }
}
