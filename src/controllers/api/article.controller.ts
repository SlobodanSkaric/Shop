import { Body, Controller, Delete, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Crud } from "@nestjsx/crud";
import { Article } from "src/entities/Article";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ArticleService } from "src/services/article/article.service";
import { diskStorage } from "multer"
import { StorageConfig } from "config/sorage.config";
import { Photo } from "src/entities/Photo";
import { PhotoService } from "src/services/photo/photo.service";
import { ApiResponse } from "src/misc/api.response.class";
import * as fileType from "file-type";
import filetype from "magic-bytes.js";
import * as fs from "fs";
import * as sharp from "sharp";
import { EditArticleDto } from "src/dtos/article/edit.article.dot";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { ArticelSearchDto } from "src/dtos/article/article.search.dto";

@Controller("api/article")
@Crud({
    model:{
        type: Article
    },
    params:{
        id:{
            field: "articleId",
            type: "number",
            primary: true
        }
    },
    query:{
        join:{
            articelFeatures:{
                eager:true
            },
            category:{
                eager: true
            },
            articlePrices:{
                eager: true
            },
            photos:{
                eager: true     
            },
            features:{
                eager: true
            }
        }
    },
    routes:{
        only: [
            "getManyBase",
            "getOneBase"
        ],
        getManyBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administraotr","user")
            ]
        },
        getOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles("administraotr","user")
            ]
        }
    }
})
export class ArticleController{
    constructor(public service: ArticleService, private photoService: PhotoService){}

    @Post("createFull")
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("administraotr")
    createFullArticle(@Body() data: AddArticleDto){
        return this.service.createFullArticel(data);
    }

    @Patch(":id")
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("administraotr")
    editFullArticle(@Param("id") articelId: number, @Body() data: EditArticleDto){
        return this.service.editFullArticle(articelId, data);
    }

    @Post(":id/uploadPhoto")
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("administraotr")
    @UseInterceptors(
        FileInterceptor("photo",{
            storage: diskStorage({
                destination: StorageConfig.photo.path,
                filename: (req, file, callback) => {
                    let original = file.originalname;
                    let normalized = original.replace(/\s+/g, "-");
                    let nowDate = new Date();
                    let stringDate: string = "";

                    stringDate+= nowDate.getFullYear().toString();
                    stringDate+= (nowDate.getMonth() + 1).toString();
                    stringDate+= nowDate.getDay().toString();

                    let tenRandomNmber = new Array(10).fill(0);
                    let randomPart = tenRandomNmber.map(e => (Math.random() * 10).toFixed(0).toString()).join("");

                    let fileName = stringDate + "-" + randomPart + "-" + normalized;

                    callback(null, fileName);

                }
            }),
            fileFilter: (req, file, callback) => {
                if(!file.originalname.match(/\.(jpg|png)$/)){
                    req.fileFilterError = "Is bad extension";
                    callback(null, false);
                    return;
                }

                if(!(file.mimetype.includes("jpeg") || file.mimetype.includes("png"))){
                    req.fileFilterError = "Is bad mimetype"
                    callback(null, false);
                    return;
                }

                callback(null, true);
            },
            limits:{
                files: 1,
                fileSize: StorageConfig.photo.size
            }
        })
    )
    async uploadPhotos(@Param("id") articalId: number, @UploadedFile() photo, @Req() req): Promise<Photo | ApiResponse>{
        if(req.fileFilterError){
            return new ApiResponse("error", -4002, req.fileFilterError);
        }

        if(!photo){
            return new ApiResponse("error", -4002, "Photo not selected");
        }

        const fileTypeResult = await filetype(fs.readFileSync(photo.path))[0]?.typename;

        if(fileTypeResult === undefined){
            fs.unlinkSync(photo.path);
            return new ApiResponse("error", -4002, "Cannot detected file type");
        }

        if((fileTypeResult != "png") && (fileTypeResult != "jpg") ){
            fs.unlinkSync(photo.path);
            return new ApiResponse("error", -4002, "Bead mimtype");
        }

        await this.createResizedImage(photo, StorageConfig.photo.thumb);
        await this.createResizedImage(photo, StorageConfig.photo.small);

        const newPhoto = new Photo();
        newPhoto.articelId = articalId;
        newPhoto.imagePath = photo.filename;

        const photoPath = await this.photoService.add(newPhoto);

        if(!photoPath){
            return new ApiResponse("Photo path is not save", -4001);
        }

        return photoPath;
    }

    async createResizedImage(photo, resizeSetting){
        const photoPath = photo.path;
        const fileName = photo.filename;

        const destinacionFilePath = StorageConfig.photo.path + resizeSetting.directory + fileName;

        await sharp(photoPath)
            .resize({
                fit: "cover",
                width: resizeSetting.width,
                height: resizeSetting.height,
                
            })
            .toFile(destinacionFilePath);
    }

    @Delete(":articleId/deletePhoto/:photoId")
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("administraotr")
    async deletePhoto(@Param("articleId") articleId: number, @Param("photoId") photoId: number){
        const photo = await this.photoService.findOne({
            where:{
                articelId: articleId,
                photoId: photoId
            }
        });

        if(!photo){
            return new ApiResponse("error", -4004, "Photo not found");
        }

        fs.unlinkSync(StorageConfig.photo.path + photo.imagePath);
        fs.unlinkSync(StorageConfig.photo.path + StorageConfig.photo.thumb.directory + photo.imagePath);
        fs.unlinkSync(StorageConfig.photo.path + StorageConfig.photo.small.directory + photo.imagePath);

        const removePhoto = await this.photoService.removePhoto(photoId);

        if(removePhoto.affected == 0){
            return new ApiResponse("error", -4005, "Can not delete this photo");
        }

        return new ApiResponse("Ok", 0, "Photo delete")
    }

    @Post("search")
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles("administraotr","user")
    async search(@Body() data: ArticelSearchDto): Promise<Article[]>{
        return await this.service.searcArticel(data);
    }
}

