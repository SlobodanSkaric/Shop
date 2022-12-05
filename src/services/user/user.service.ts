import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { UserRegistrationDto } from "src/dtos/users/user.registration.dto";
import { User } from "src/entities/User";
import { Repository } from "typeorm";
import * as crypto from "crypto";
import { ApiResponse } from "src/misc/api.response.class";
@Injectable()
export class UserService extends TypeOrmCrudService<User>{
    constructor(@InjectRepository(User) private readonly user: Repository<User>){
        super(user);
    }

    async registration(data: UserRegistrationDto): Promise<User | ApiResponse>{
        const passwordHash = crypto.createHash("SHA512");
        passwordHash.update(data.password);

        const passwordHashString = passwordHash.digest("hex").toUpperCase();

        const newUser: User = new User();

        newUser.email = data.email;
        newUser.forname = data.forname;
        newUser.surname = data.surname;
        newUser.passwordHash = passwordHashString;
        newUser.phoneNumber = data.phoneNumber;
        newUser.postalAddress = data.postalAddress;

        try{
            const saveUser = await this.user.save(newUser);

            if(!saveUser){
                throw new Error("");
            }

            return saveUser;

        }catch(e){
            return new ApiResponse("error", -6000, "User not create");
        }

       
    }
}