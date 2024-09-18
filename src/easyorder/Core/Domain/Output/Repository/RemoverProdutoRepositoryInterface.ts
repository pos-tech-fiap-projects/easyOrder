import { ProdutoEntity } from "../../Entity/ProdutoEntity";

export interface RemoverProdutoUsecaseInput {
    id: string;
}

export interface RemoverProdutoUsecaseOutput {
    sucesso: boolean;
    mensagem?: string;
}


