import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Administrator } from 'entities/administrator.entity';
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from "crypto";
import { EditAdminstratorDto } from "src/dtos/administrator/edit.administrator.dto";

@Controller("api/administrator")
export class AdministratorController{
    constructor(private administratorService: AdministratorService){}

    @Get()
    getAll(): Promise<Administrator[]>{
        return this.administratorService.getAll();
    }

    @Get(":id")
    getById(@Param("id") administratorId: number): Promise<Administrator>{
        return this.administratorService.getById(administratorId);
    }

    @Put()
    add(@Body() data: AddAdministratorDto): Promise<Administrator>{
        return this.administratorService.add(data);
    }

    @Post(":id")
    edit(@Body() data: EditAdminstratorDto, @Param("id") adminId: number): Promise<Administrator>{
        return this.administratorService.editById(adminId, data);
    }
}