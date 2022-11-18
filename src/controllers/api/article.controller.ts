import { Body, Controller, Param, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Crud } from "@nestjsx/crud";
import { Article } from "entities/Article";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ArticleService } from "src/services/article/article.service";
import { diskStorage } from "multer"
import { StorageConfig } from "config/sorage.config";
import { Photo } from "entities/Photo";
import { PhotoService } from "src/services/photo/photo.service";
import { ApiResponse } from "src/misc/api.response.class";
import * as fileType from "file-type";
import filetype from "magic-bytes.js";
import * as fs from "fs";
import * as sharp from "sharp";

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
    }
})
export class ArticleController{
    constructor(public service: ArticleService, private photoService: PhotoService){}

    @Post("createFull")
    createFullArticle(@Body() data: AddArticleDto){
        return this.service.createFullArticel(data);
    }

    @Post(":id/uploadPhoto")
    @UseInterceptors(
        FileInterceptor("photo",{
            storage: diskStorage({
                destination: StorageConfig.photos,
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
                fileSize: StorageConfig.fileSizeMax
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

        await this.imageThumb(photo);
        await this.imageSmall(photo);

        const newPhoto = new Photo();
        newPhoto.articelId = articalId;
        newPhoto.imagePath = photo.filename;

        const photoPath = await this.photoService.add(newPhoto);

        if(!photoPath){
            return new ApiResponse("Photo path is not save", -4001);
        }

        return photoPath;
    }

    async imageThumb(photo){
        const photoPath = photo.path;
        const fileName = photo.filename;

        const destinacionFilePath = StorageConfig.photos + "thumb/" + fileName;

        await sharp(photoPath)
            .resize({
                fit: "cover",
                width: StorageConfig.photoThumb.width,
                height: StorageConfig.photoThumb.height,
                background: {
                    r:255, g:255, b:255, alpha: 0.0
                }
            })
            .toFile(destinacionFilePath);
    }

    async imageSmall(photo){
        const photoPath = photo.path;
        const fileName = photo.filename;

        const destinacionFilePath = StorageConfig.photos + "small/" + fileName;

        await sharp(photoPath)
            .resize({
                fit: "cover",
                width: StorageConfig.photoSmall.width,
                height: StorageConfig.photoSmall.height,
                background: {
                    r:255, g:255, b:255, alpha: 0.0
                }
            })
            .toFile(destinacionFilePath);
    }
}

