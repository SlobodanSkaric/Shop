import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Category } from "src/entities/Category";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { CategoryService } from "src/services/category/category.service";

@Controller("api/category")
@Crud({
    model:{
        type: Category
    },
    params: {
        id:{
            field:  "categoryId",
            type: "number",
            primary: true
        }
    },
    query:{
        join:{
            categories:{
                eager:true
            },
            parentCategory:{
                eager: false
            },
            articles:{
                eager: false
            },
            features:{
                eager: true
            }
        }
    },
    routes: {
        only:[
            "createManyBase",
            "createOneBase",
            "getManyBase",
            "getOneBase",
            "updateOneBase"
        ],
        createManyBase:{
            decorators:[
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administraotr")
            ]
        },
        createOneBase:{
            decorators:[
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administraotr")
            ]
        },
        getManyBase:{
            decorators:[
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administraotr","user")
            ]
        },
        getOneBase:{
            decorators:[
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administraotr", "user")
            ]
        },
        updateOneBase:{
            decorators:[
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administraotr")
            ]
        },
    }
})
export class CategoryController{
    constructor(public service: CategoryService){}
}