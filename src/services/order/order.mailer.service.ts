import { Injectable } from "@nestjs/common";
import { Order } from "src/entities/Order";
import { MailerService } from "@nestjs-modules/mailer";
import { CartArticel } from "src/entities/CartArticel";

@Injectable()
export class OrderMailerService{
    constructor(private readonly mailerService: MailerService){}

    async sendOrderMail(order: Order){
       await this.mailerService.sendMail({
            to: order.cart.user.email,
            bcc: "slobodan.skaric@gmail.com",
            subject: "Order detaile",
            encoding: "URF-8",
            html: this.makeOrderHtml(order)
        });
    }

    private makeOrderHtml(order: Order): string{
        //implementirati sumu za placanje
        return `<p>Hvala na porudzbini</p>
                <p>Ovo su detalji vase porudzbine:<p>
                <ul>
                    ${ order.cart.cartArticels.map((cartArt: CartArticel) => {
                        return `<li>
                                    ${ cartArt.articel.name } X ${ cartArt.quantiry }
                                </li>`
                    }).join("")}
                </ul>
                <p>Suma je : Jos nije imlementirano</p>
                <p>Potpis : Jos nije imlementirano</p>
                `
    }
}