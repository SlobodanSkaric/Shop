import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Article } from "./Article";
import { Cart } from "./Cart";

@Index("uq_cart_article_cart_id_articel_id", ["cartId", "articelId"], {
  unique: true,
})
@Index("fk_cart_article_article_id", ["articelId"], {})
@Entity("cart_articel")
export class CartArticel {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "cart_articel_id",
    unsigned: true,
  })
  cartArticelId: number;

  @Column("int", { name: "cart_id", unsigned: true, default: () => "'0'" })
  cartId: number;

  @Column("int", { name: "articel_id", unsigned: true, default: () => "'0'" })
  articelId: number;

  @Column("int", { name: "quantiry", unsigned: true, default: () => "'0'" })
  quantiry: number;

  @ManyToOne(() => Article, (article) => article.cartArticels, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "articel_id", referencedColumnName: "articleId" }])
  articel: Article;

  @ManyToOne(() => Cart, (cart) => cart.cartArticels, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "cart_id", referencedColumnName: "cartId" }])
  cart: Cart;
}
