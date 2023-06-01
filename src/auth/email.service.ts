
import { Injectable } from '@nestjs/common';
import { MailService, MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class EmailService {
    constructor(private readonly mailService: MailService){
        this.mailService.setApiKey(process.env.SEND_GRID_KEY);
    }
    
    async send(mail: MailDataRequired){
        const response = await this.mailService.send(mail);   

        console.log('Email send to ' + mail.to);
        return response;
    }
}