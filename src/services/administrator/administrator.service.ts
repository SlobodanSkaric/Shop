import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Administrator } from 'entities/Administrator';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { Repository } from "typeorm"
import * as crypto from "crypto";
import { EditAdminstratorDto } from 'src/dtos/administrator/edit.administrator.dto';
import { ApiResponse } from 'src/misc/api.response.class';

@Injectable()
export class AdministratorService {
    constructor(@InjectRepository(Administrator) private readonly administrator: Repository<Administrator>){}

    getAll(): Promise<Administrator[]>{
        return this.administrator.find();   
    }

    async getByUsername(username: string): Promise<Administrator | null>{
        let admin = await this.administrator.findOne({where: {username: username}});

        if(admin){
            return admin;
        }

        return null;
    }

    async getById(id: number): Promise<Administrator | ApiResponse>{
        let administrator: Administrator = await this.administrator.findOneBy({administratorId: id});

        if(administrator === null){
            return new Promise((resolve) => {
                resolve(new ApiResponse("error", -1002));
            })
        }
        return administrator;
    }

    async add(data: AddAdministratorDto): Promise<Administrator | ApiResponse>{
        const passwordHash = crypto.createHash("SHA512");
        passwordHash.update(data.password);

        const passwordHashString = passwordHash.digest("hex").toUpperCase();

        let newAdmin: Administrator = new Administrator();
        newAdmin.username = data.username;
        newAdmin.passwordHash = passwordHashString;

        return new Promise((resolve, reject) => {
            this.administrator.save(newAdmin)
            .then(data => resolve(data))
            .catch(err => {
                const respone: ApiResponse = new ApiResponse("error", -1001);
                resolve(respone);
            })
        })

       
    }

    async editById(id: number, data: EditAdminstratorDto): Promise<Administrator | ApiResponse>{
        let updateAdmin: Administrator = await this.administrator.findOneBy({administratorId: id});

       if(updateAdmin === null){
            return new Promise((resolve) => {
                resolve(new ApiResponse("error", -1002));
            })
        }

        const passwordHash = crypto.createHash("SHA512");
        passwordHash.update(data.password);
        
        const passwordHashString = passwordHash.digest("hex").toUpperCase();

        updateAdmin.passwordHash = passwordHashString;

        return this.administrator.save(updateAdmin);
    }
}
