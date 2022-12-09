import { Body, Controller, Get, Param, Patch, Post, Put, SetMetadata, UseGuards } from "@nestjs/common";
import { Administrator } from 'src/entities/administrator.entity';
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from "crypto";
import { EditAdminstratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";

@Controller("api/administrator")
export class AdministratorController{
    constructor(private administratorService: AdministratorService){}

    @Get()
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("administraotr")
    getAll(): Promise<Administrator[]>{
        return this.administratorService.getAll();
    }

    @Get(":id")
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("administraotr")
    getById(@Param("id") administratorId: number): Promise<Administrator | ApiResponse>{
        return this.administratorService.getById(administratorId);
    }

    @Post()
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("administraotr")
    add(@Body() data: AddAdministratorDto): Promise<Administrator | ApiResponse>{
        return this.administratorService.add(data);
    }

    @Patch(":id")
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("administraotr")
    edit(@Body() data: EditAdminstratorDto, @Param("id") adminId: number): Promise<Administrator | ApiResponse>{
        return this.administratorService.editById(adminId, data);
    }
}