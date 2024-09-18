

import { ExemploEntity } from "../../Entity/ExemploEntity";

export interface ExemploRepositoryInterface {
    listarTodos(): ExemploEntity[]
}