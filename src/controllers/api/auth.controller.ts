import { Body, Controller, HttpException, HttpStatus, Post, Put, Req, UseGuards } from "@nestjs/common";
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
import { JwtRefreshDataDto } from "src/dtos/auth/jwt.refresh.data";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { UserRefreshTokenDto } from "src/dtos/auth/user.refresh.token";

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

       
        jwtData.exp = this.getDatePlus(60 * 60 * 24 * 31);

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSicret);

        let responseObjec = new LoginInfoDto(administrator.administratorId, administrator.username, token, "","");

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
        jwtData.exp = this.getDatePlus(60 * 5);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSicret);

        //Refresh token

        const jwtRefreshData = new JwtRefreshDataDto();

        jwtRefreshData.role  = "user";
        jwtRefreshData.id = userData.userId;
        jwtRefreshData.identetiy = userData.email;
        jwtRefreshData.exp = this.getDatePlus(60 * 60 * 24 * 31);
        jwtRefreshData.ip = req.ip.toString();
        jwtRefreshData.ua = req.header["user-agent"];

        let refreshToken: string = jwt.sign(jwtData.toPlainObject(), jwtSicret);

        let responseObjec = new LoginInfoDto(userData.userId, userData.email, token, refreshToken, this.getIsoDate(jwtRefreshData.exp));

        await this.userService.addToken(userData.userId, refreshToken, this.getDatabaseDate(this.getIsoDate(jwtRefreshData.exp)))

        return new Promise(resolve => resolve(responseObjec));
   }

   @Post("user/register")
   async userRegistration(@Body() data: UserRegistrationDto){
        return await this.userService.registration(data);
   }

   @Post("user/refresh")
    async userTokenRefresh(@Req() req: Request, @Body() data: UserRefreshTokenDto): Promise<LoginInfoDto | ApiResponse>{
        const userToken = await this.userService.getToken(data.token);

        if(!userToken){
            return new ApiResponse("error", -10002, "No such refresh token");
        }

        if(userToken.isValid === 0){
            return new ApiResponse("error", -10003, "Token is no loger valid");
        }

        const nowDate = new Date();
        const exiresDate = new Date(userToken.expiriesAt);

        if(exiresDate.getTime() < nowDate.getTime()){
            return new ApiResponse("error", -10004, "The token hes expires");
        }
        
        let jwtRefresData: JwtRefreshDataDto;
        
        try{
            jwtRefresData = jwt.verify(data.token, jwtSicret);
        }catch(e){
            throw new HttpException("Bad token1", HttpStatus.UNAUTHORIZED); 
        }

        if(!jwtRefresData){
            throw new HttpException("Bad token2", HttpStatus.UNAUTHORIZED); 
        }

        if(jwtRefresData.ip != req.ip.toString()){
            throw new HttpException("Bad token3", HttpStatus.UNAUTHORIZED); 
        }

        if(jwtRefresData.ua != req.headers["user-agent"]){
            throw new HttpException("Bad token4", HttpStatus.UNAUTHORIZED); 
        }

        const jwtData = new JwtDataDto();
        jwtData.role = jwtRefresData.role;
        jwtData.id = jwtRefresData.id;
        jwtData.identetiy = jwtRefresData.identetiy;
        jwtData.exp = this.getDatePlus(60 * 5);
        jwtData.ip = jwtRefresData.ip;
        jwtData.ua = jwtRefresData.ua;

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSicret);
        let responseObjec = new LoginInfoDto(jwtData.id, jwtData.identetiy, token, data.token, this.getIsoDate(jwtData.exp));


        return responseObjec;

    }


   private getDatePlus(numbersOfSeconds: number): number{
        return new Date().getTime() / 1000 + numbersOfSeconds;
   }

   private getIsoDate(timestamp: number): string{
        const date = new Date();
        date.setTime(timestamp * 1000);
        return date.toISOString();
   }

   private getDatabaseDate(isoData: string): string{
        return isoData.substring(0, 19).replace("T", " ");
   }
}