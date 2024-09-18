import { ClienteEntity } from "../../../Domain/Entity/ClienteEntity";
import { ClienteRepositoryInterface } from "../../../Domain/Output/Repository/ClienteRepositoryInterface";
import { CpfValueObject } from "../../../Domain/ValueObject/CpfValueObject";
import { EmailValueObject } from "../../../Domain/ValueObject/EmailValueObject";

export class BuscarClientesUsecaseResponse {
    private mensagem: string | null = null;
    private cliente: ClienteEntity | null = null;

    constructor(message: string | null, cliente?: ClienteEntity | null) {

        if (message) {
            this.mensagem = message;
        }

        this.cliente = cliente || null;
    }
    
    public getMensagem() {
        return this.mensagem;
    }

    public getCliente() {
        return this.cliente;
    }
}

export class BuscarClienteUsecase {

    constructor(
        private readonly clienteRepository: ClienteRepositoryInterface
    ) { }

    public async execute(cpf: string): Promise<BuscarClientesUsecaseResponse> {

        try {

            if (!cpf) {
                throw new Error('Dados incorretos: CPF não informado.');
            }

            const cpfValue = new CpfValueObject(cpf);

            const cliente = await this.clienteRepository.buscarClientePorCpf(cpfValue);
            if (cliente === undefined) {
                throw new Error('Cadastro de Cliente não encontrado.');
            }

            return new BuscarClientesUsecaseResponse("Cliente identificado com Sucesso.", cliente);

        } catch (error: any) {
            return new BuscarClientesUsecaseResponse(error.message, null);
        }
    }

}
