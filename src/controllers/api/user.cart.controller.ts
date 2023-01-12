import { Body, Controller, Get, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AddArticelToCart } from "src/dtos/cart/add.artocle.to.cart.dto";
import { ChangeQauntityToCurentCart } from "src/dtos/cart/change.quantiy.to.curentcart.dto";
import { Cart } from "src/entities/Cart";
import { CartArticel } from "src/entities/CartArticel";
import { Order } from "src/entities/Order";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { ApiResponse } from "src/misc/api.response.class";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { CartService } from "src/services/cart/cart.service";
import { OrderMailerService } from "src/services/order/order.mailer.service";
import { OrderService } from "src/services/order/order.service";

@Controller("api/user/cart")
export class UserCartController{
    constructor(private cartService: CartService,private order: OrderService, private mailerService: OrderMailerService){}

    async getActiveCartForUserId(userId: number): Promise<Cart>{
        let cart =  await this.cartService.getLastActiveCartbyUserId(userId);

        if(!cart){
            cart = await this.cartService.createNewCart(userId);
        }

        return this.cartService.getById(cart.cartId);
    }

    @Get()
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("user")
    async getCurrentCart(@Req() req: Request): Promise<Cart>{
        return await this.getActiveCartForUserId(req.token.id);
    }

    @Post("addTocart")
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("user")
    async addArticelToCart(@Body() data: AddArticelToCart, @Req() req: Request): Promise<Cart>{
        const cart = await this.getActiveCartForUserId(req.token.id);

        return await this.cartService.addArticelToCart(cart.cartId, data.articelId, data.quantity);
    }

    @Patch()
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("user")
    async changeQuanty(@Body() data: ChangeQauntityToCurentCart, @Req() req: Request): Promise<Cart>{
        const cartId = await this.getActiveCartForUserId(req.token.id);

        return await this.cartService.changeQauntity(cartId.cartId, data.articleId, data.quantity)
    }

    @Post("makeorder")
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("user")
    async makeOrder(@Req() req: Request): Promise<Order | ApiResponse>{
        const cartId = await this.getActiveCartForUserId(req.token.id);

        const order =  await this.order.add(cartId.cartId);

        if(order instanceof ApiResponse){
            return order;
        }

        await this.mailerService.sendOrderMail(order);

        return order;
    }
}