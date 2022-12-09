import { Controller, UseGuards } from "@nestjs/common";
import {Crud } from "@nestjsx/crud";
import { Feature } from "src/entities/Feature";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { FeatureService } from "src/services/feature/feature.service";

@Controller("api/feature")
@Crud({
    model:{
        type: Feature
    },
    params: {
        id:{
            field:  "featureId",
            type: "number",
            primary: true
        }
    },
    query:{
        join:{
           /*  categories:{
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
            } */

            articelFeatures:{
                eager: false
            },
            category:{
                eager: true
            },
            article:{
                eager: true
            }
        }
    },
    routes:{
        only: [
            "createManyBase",
            "createOneBase",
            "getManyBase",
            "getOneBase",
            "updateOneBase"
        ],
        createManyBase: {
            decorators:[
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administraotr")
            ]
        },
        createOneBase: {
            decorators:[
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administraotr")
            ]
        },
        getManyBase: {
            decorators:[
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administraotr", "user")
            ]
        },
        getOneBase: {
            decorators:[
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administraotr", "user")
            ]
        },
        updateOneBase: {
            decorators:[
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administraotr")
            ]
        },
    }
})
export class FeatureController{
    constructor(public service: FeatureService){}
}