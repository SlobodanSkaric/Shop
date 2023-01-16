import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import * as Validator from "class-validator";


@Index("user_token_user_id_fk", ["userId"], {})
@Entity("user_token")
export class UserToken {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "user_token_id",
    unsigned: true,
  })
  userTokenId: number;

  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowInfinity:false,
    allowNaN:false,
    maxDecimalPlaces:0
  })
  @Validator.IsNumber()
  @Column("int", { name: "user_id", unsigned: true, default: () => "'0'" })
  userId: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Column("text", { name: "token" })
  token: string;

  @Column("datetime", { name: "expiries_at" })
  expiriesAt: Date;

  @Validator.IsNotEmpty()/* 
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowInfinity:false,
    allowNaN:false,
    maxDecimalPlaces:0
  }) */
  @Validator.IsIn([0,1])
  @Column("tinyint", { name: "is_valid", unsigned: true, default: () => "'1'" })
  isValid: number;

  @ManyToOne(() => User, (user) => user.userTokens, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
