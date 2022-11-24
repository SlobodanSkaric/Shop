import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("user_token_user_id_fk", ["userId"], {})
@Entity("user_token")
export class UserToken {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "user_token_id",
    unsigned: true,
  })
  userTokenId: number;

  @Column("int", { name: "user_id", unsigned: true, default: () => "'0'" })
  userId: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("text", { name: "token" })
  token: string;

  @Column("datetime", { name: "expiries_at" })
  expiriesAt: Date;

  @Column("tinyint", { name: "is_valid", unsigned: true, default: () => "'1'" })
  isValid: number;

  @ManyToOne(() => User, (user) => user.userTokens, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
