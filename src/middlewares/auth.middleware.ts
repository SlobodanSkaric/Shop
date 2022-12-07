import { NestMiddleware, HttpException, HttpStatus,Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as jwt from "jsonwebtoken";
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { jwtSicret } from "config/jwt.sicret";
import { UserService } from "src/services/user/user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(private readonly administratorService: AdministratorService, 
                private readonly userService: UserService){}
    async use(req: Request, res: Response, next: NextFunction) {
        if(!req.headers.authorization){
            throw new HttpException("Token not foind", HttpStatus.UNAUTHORIZED); 
        }

        const token = req.headers.authorization;
        const tokenParts = token.split(" ");

        if(tokenParts.length !== 2){
            throw new HttpException("Bad token", HttpStatus.UNAUTHORIZED); 
        }

        const tokenString = tokenParts[1];
        
        let jwtData: JwtDataDto;
        
        try{
            jwtData = jwt.verify(tokenString, jwtSicret);
        }catch(e){
            throw new HttpException("Bad token", HttpStatus.UNAUTHORIZED); 
        }
       

        if(!jwtData){
            throw new HttpException("Bad token", HttpStatus.UNAUTHORIZED); 
        }

        if(jwtData.ip != req.ip.toString()){
            throw new HttpException("Bad token", HttpStatus.UNAUTHORIZED); 
        }

        if(jwtData.ua != req.headers["user-agent"]){
            throw new HttpException("Bad token", HttpStatus.UNAUTHORIZED); 
        }

        if(jwtData.role == "administraotr"){
            const administrator = await this.administratorService.getById(jwtData.id);

            if(!administrator){
                throw new HttpException("Account not found", HttpStatus.UNAUTHORIZED); 
            }
        }else if(jwtData.role == "user"){
            const administrator = await this.userService.getById(jwtData.id);

            if(!administrator){
                throw new HttpException("Account not found", HttpStatus.UNAUTHORIZED); 
            }
        }

        

        const curentTime = new Date().getTime() /1000;

        if(curentTime >= jwtData.exp){
            throw new HttpException("Token exired", HttpStatus.UNAUTHORIZED); 
        }

        req.token = jwtData;

        next();
    }

}