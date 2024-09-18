import { EmailServiceInterface } from "../../../Core/Domain/Output/Service/EmailServiceInterface";

export class EmailServiceMock implements EmailServiceInterface {
    public async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
        console.log('Email enviado para ' + to + ' com o assunto ' + subject + ' e o corpo ' + body);
        return true;
    }
}