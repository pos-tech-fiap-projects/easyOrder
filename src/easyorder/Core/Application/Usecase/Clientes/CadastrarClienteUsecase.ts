import { ClienteEntity } from "../../../Domain/Entity/ClienteEntity";
import { ClienteRepositoryInterface } from "../../../Domain/Output/Repository/ClienteRepositoryInterface";
import { CpfValueObject } from "../../../Domain/ValueObject/CpfValueObject";
import { EmailValueObject } from "../../../Domain/ValueObject/EmailValueObject";

export class CadastrarClienteUsecaseResponse {
    private sucesso_cadastro: boolean;
    private mensagem: string | null = null;
    private cliente: ClienteEntity | null = null;

    constructor(sucesso_cadastro: boolean, message: string | null, cliente?: ClienteEntity | null) {
        this.sucesso_cadastro = sucesso_cadastro;

        if (message) {
            this.mensagem = message;
        }

        this.cliente = cliente || null;
    }

    public getSucessoCadastro() {
        return this.sucesso_cadastro;
    }

    public getMensagem() {
        return this.mensagem;
    }

    public getCliente() {
        return this.cliente;
    }
}

export class CadastrarClienteUsecase {

    constructor(
        private readonly clienteRepository: ClienteRepositoryInterface
    ) { }

    public async execute(cpf: string, nome: string, email: string): Promise<CadastrarClienteUsecaseResponse> {

        try {

            if (!cpf) {
                throw new Error('Dados incorretos: CPF não informado.');
            }

            const cpfValue = new CpfValueObject(cpf);
            const emailValue = new EmailValueObject(email);

            // Buscar cliente já cadastrado no sistema
            const clienteExistente = await this.clienteRepository.buscarClientePorCpf(cpfValue);
            if (clienteExistente !== undefined) {
                throw new Error('Cliente já cadastrado com esse CPF');
            }

            // Salvar o cliente no repositório e retornar o resultado
            const cliente = new ClienteEntity(cpfValue, nome, emailValue);
            await this.clienteRepository.adicionarCliente(cliente);

            return new CadastrarClienteUsecaseResponse(true, 'Cliente cadastrado com sucesso.', cliente);

        } catch (error: any) {
            return new CadastrarClienteUsecaseResponse(false, error.message);
        }
    }

}
