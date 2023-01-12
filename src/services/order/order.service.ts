import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChangeOrderStatusDto } from "src/dtos/order/change.order.status.dto";
import { Cart } from "src/entities/Cart";
import { Order } from "src/entities/Order";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class OrderService{
    constructor(@InjectRepository(Cart) private readonly cart:Repository<Cart>,
                @InjectRepository(Order) private readonly order: Repository<Order> ){}

    async add(cartId: number): Promise<Order | ApiResponse>{
        const order = await this.order.findOne({where: { cartId: cartId}});

        if(order){
            return new ApiResponse("error", -7001);
        }

        const cart = await this.cart.findOne({ 
            where: {cartId: cartId},
            relations: ["cartArticels"]
        });

        if(!cart){
            return new ApiResponse("error", -7002);
        }

        if(cart.cartArticels.length === 0){
            return new ApiResponse("error", -7003);
        }

        const orderadd = new Order();

        orderadd.cartId = cartId;

        const saveOrdere = await this.order.save(orderadd);

        return await this.order.findOne({
            where:{orderId: saveOrdere.orderId},
            relations: ["cart","cart.user","cart.cartArticels","cart.cartArticels.articel","cart.cartArticels.articel.category","cart.cartArticels.articel.articlePrices"]
        });
    }

    async getOrder(id: number): Promise<Order | ApiResponse>{
        const orderCheck = await this.order.findOne({ where: {orderId: id},
                                                    relations: [
                                                        "cart","cart.user",
                                                        "cart.cartArticels",
                                                        "cart.cartArticels.articel",
                                                        "cart.cartArticels.articel.category",
                                                        "cart.cartArticels.articel.articlePrices"
                                                    ]});

        if(!orderCheck){
            return new ApiResponse("error", -8000, "Order is bot existe");
        }

        return orderCheck;
    }

    async changeOrder(id: number, statusSet): Promise<Order | ApiResponse>{
        const orderChekc = await this.order.findOne({ where :{ orderId: id}});

        if(!orderChekc){
            return new ApiResponse("error", -8001, "Order is bot existe");
        }

        orderChekc.status = statusSet.status;
        
        await this.order.save(orderChekc);

        return this.getOrder(id);


    }
}