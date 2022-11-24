import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { CartArticel } from "./CartArticel";
import { Order } from "./Order";

@Index("fk:_cart_user_id", ["userId"], {})
@Entity("cart")
export class Cart {
  @PrimaryGeneratedColumn({ type: "int", name: "cart_id", unsigned: true })
  cartId: number;

  @Column("int", { name: "user_id", unsigned: true, default: () => "'0'" })
  userId: number;

  @Column("timestamp", {
    name: "created_et",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdEt: Date;

  @ManyToOne(() => User, (user) => user.carts, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => CartArticel, (cartArticel) => cartArticel.cart)
  cartArticels: CartArticel[];

  @OneToOne(() => Order, (order) => order.cart)
  order: Order;
}
