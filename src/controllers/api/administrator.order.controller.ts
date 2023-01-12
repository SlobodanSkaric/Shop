import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { ChangeOrderStatusDto } from "src/dtos/order/change.order.status.dto";
import { Order } from "src/entities/Order";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { ApiResponse } from "src/misc/api.response.class";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { OrderService } from "src/services/order/order.service";

@Controller("api/order")
export class AdminstratorOrderController{
    constructor(private readonly order: OrderService){}

    @Get(":id")
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("administraotr")
    async get(@Param("id") id: number): Promise<Order |ApiResponse>{
        const orderGetId = await this.order.getOrder(id);

        return orderGetId;
    }

    @Patch(":id")
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("administraotr")
    async changeStatus(@Param("id") id: number,@Body() status: ChangeOrderStatusDto){
        const changeStatus = await this.order.changeOrder(id, status);

        return changeStatus;
    }
}