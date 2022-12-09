import { Body, Controller, Post, Put, Req } from "@nestjs/common";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from "crypto";
import { LoginInfoDto } from "src/dtos/auth/login.info.dto";
import * as jwt from "jsonwebtoken";
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { Request } from "express";
import { jwtSicret } from "config/jwt.sicret";
import { UserRegistrationDto } from "src/dtos/users/user.registration.dto";
import { UserService } from "src/services/user/user.service";
import { LoginUserDto } from "src/dtos/users/login.user.dto";

@Controller("auth")
export class AuthController{
   constructor(private administratorService: AdministratorService, private userService: UserService){}

   @Post("administrator/login")
   async doAdministratorLogin(@Body() data: LoginAdministratorDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse>{
        let administrator = await this.administratorService.getByUsername(data.username);

        if(!administrator){
            return new Promise(resolve => {
                resolve(new ApiResponse("error", -3001));
            })
        }

        const passwordHash = crypto.createHash("sha512");
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest("hex").toUpperCase();

        if(administrator.passwordHash != passwordHashString){
            return new Promise(resolve => {
                resolve(new ApiResponse("error", -3003));
            })
        }

        const jwtData = new JwtDataDto();
        jwtData.role = "administraotr";
        jwtData.id = administrator.administratorId;
        jwtData.identetiy = administrator.username;

        let nowDate = new Date();
        nowDate.setDate(nowDate.getDate() + 14);
        const expTime = nowDate.getTime() / 1000;
        jwtData.exp = expTime;

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSicret);

        let responseObjec = new LoginInfoDto(administrator.administratorId, administrator.username, token);

        return new Promise(resolve => resolve(responseObjec));
   }

   @Post("user/login")
   async doUserLogin(@Body() data: LoginUserDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse>{
        let userData = await this.userService.getByEmail(data.email);

        if(!userData){
            return new Promise(resolve => {
                resolve(new ApiResponse("error", -3001));
            })
        }

        const passwordHash = crypto.createHash("sha512");
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest("hex").toUpperCase();

        if(userData.passwordHash != passwordHashString){
            return new Promise(resolve => {
                resolve(new ApiResponse("error", -3003));
            })
        }

        const jwtData = new JwtDataDto();
        jwtData.role = "user";
        jwtData.id = userData.userId;
        jwtData.identetiy = userData.email;

        let nowDate = new Date();
        nowDate.setDate(nowDate.getDate() + 14);
        const expTime = nowDate.getTime() / 1000;
        jwtData.exp = expTime;

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSicret);

        let responseObjec = new LoginInfoDto(userData.userId, userData.email, token);

        return new Promise(resolve => resolve(responseObjec));
   }

   @Post("user/register")
   async userRegistration(@Body() data: UserRegistrationDto){
        return await this.userService.registration(data);
   }
}