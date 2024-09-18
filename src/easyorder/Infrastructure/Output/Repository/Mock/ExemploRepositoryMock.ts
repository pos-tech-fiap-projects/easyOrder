import { ExemploRepositoryInterface } from "../../../../Core/Domain/Output/Repository/ExemploRepositoryInterface";
import { ExemploEntity } from "../../../../Core/Domain/Entity/ExemploEntity";
import { EnderecoValueObject } from "../../../../Core/Domain/ValueObject/EnderecoValueObject";

export class ExemploRepositoryMock implements ExemploRepositoryInterface {

    constructor(
        private readonly mockResultList: string[]
    ) { }

    public listarTodos(): ExemploEntity[] {
        const lista = [];

        for (const item of this.mockResultList) {
            lista.push(
                new ExemploEntity(
                    `Exemplo ${item}`,
                    new EnderecoValueObject(
                        'Rua Teste',
                        123,
                    )
                )
            );
        }

        return lista;
    }

}