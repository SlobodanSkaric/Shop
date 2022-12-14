import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Administrator{
    @PrimaryGeneratedColumn({name: "administrator_id", type: "int", unsigned: true})
    administratorId: number;

    @Column({name: "username", type: "varchar",length: "128", unique: true})
    username: string;

    @Column({name: "password_hash", type: "varchar", length: "128"})
    passwordHash: string;
}