import * as Validator from "class-validator";


export class ChangeOrderStatusDto{
    @Validator.IsNotEmpty()
    @Validator.IsIn(["rejected", "acceptred", "shipped", "pending"])
    @Validator.IsString()
    status: "rejected" | "acceptred" | "shipped" | "pending"
}   