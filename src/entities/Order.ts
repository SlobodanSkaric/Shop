import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./Cart";

@Index("uq_order_cart_id", ["cartId"], { unique: true })
@Entity("order")
export class Order {
  @PrimaryGeneratedColumn({ type: "int", name: "order_id", unsigned: true })
  orderId: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("int", {
    name: "cart_id",
    unique: true,
    unsigned: true,
    default: () => "'0'",
  })
  cartId: number;

  @Column("enum", {
    name: "status",
    enum: ["rejected", "acceptred", "shipped", "pending"],
    default: () => "'pending'",
  })
  status: "rejected" | "acceptred" | "shipped" | "pending";

  @OneToOne(() => Cart, (cart) => cart.order, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "cart_id", referencedColumnName: "cartId" }])
  cart: Cart;
}
