import * as Validator from "class-validator";

export class EditAdminstratorDto{
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(6,128)
    password: string;
}