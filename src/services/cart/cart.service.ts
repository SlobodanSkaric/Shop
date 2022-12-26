import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "src/entities/Article";
import { Cart } from "src/entities/Cart";
import { CartArticel } from "src/entities/CartArticel";
import { Order } from "src/entities/Order";
import { Repository } from "typeorm";

@Injectable()
export class CartService{
    constructor(
        @InjectRepository(Cart) private readonly cart: Repository<Cart>,
        @InjectRepository(CartArticel) private readonly cartArticle: Repository<CartArticel>,
        @InjectRepository(Article) private readonly article: Repository<Article>,
        @InjectRepository(Order) private readonly order: Repository<Order>,
        ){ }

       async getLastActiveCartbyUserId(userId: number): Promise<Cart | null>{
        const carts = await this.cart.find({
            where : {
                userId: userId
            },
            order: {
                createdEt: "DESC"
            },
            take:1,
            relations: ["order"]
        });

        if(!carts || carts.length == 0){
            return null;
        }

        const cart = carts[0];

        if(cart.order !== null){
            return null;
        }

        return cart;
       }

       async createNewCart(userId: number): Promise<Cart>{
        const newCart: Cart = new Cart();
        newCart.userId = userId;
        return await this.cart.save(newCart);
       }

       async addArticelToCart(cartId: number, articelId: number, quantity: number): Promise<Cart>{
        let record: CartArticel = await this.cartArticle.findOne({
            where:{
                cartId: cartId,
                articelId: articelId
            }
        });

        if(!record){
            record = new CartArticel();
            record.cartId = cartId;
            record.articelId = articelId;
            record.quantiry = quantity;

            record = await this.cartArticle.save(record);
        }else{
            record.quantiry += quantity;
        }

        await this.cartArticle.save(record);

        return this.getById(cartId)
       }

       async getById(cartId: number): Promise<Cart>{
        return await this.cart.findOne({
            where:{
                cartId: cartId
            },
            relations: [
                "user",
                "cartArticels",
                "cartArticels.articel",
                "cartArticels.articel.category"
            ]
        })
       }

       async changeQauntity(cartId: number, articleId: number, quantity: number): Promise<Cart>{
        const record = await this.cartArticle.findOne({
            where:{
                cartId: cartId,
                articelId: articleId
            }
        });

        if(record){
            record.quantiry = quantity;

            if(record.quantiry == 0){
                await this.cartArticle.delete(record.cartArticelId);
            }else{
                await this.cartArticle.save(record);
            }
        }

        return await this.getById(cartId);
        
       }


}