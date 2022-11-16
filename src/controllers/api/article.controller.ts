import { Body, Controller, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
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
                    callback(new Error("IS bad extension"), false);
                    return;
                }

                if(!(file.mimetype.includes("jpeg") || file.mimetype.includes("png"))){
                    callback(new Error("IS bad mimetype"), false);
                    return;
                }

                callback(null, true);
            },
            limits:{
                files: 1,
                fieldSize: StorageConfig.fileSizeMax
            }
        })
    )
    async uploadPhotos(@Param("id") articalId: number, @UploadedFile() photo): Promise<Photo | ApiResponse>{
        const newPhoto = new Photo();
        newPhoto.articelId = articalId;
        newPhoto.imagePath = photo.filename;

        const photoPath = await this.photoService.add(newPhoto);

        if(!photoPath){
            return new ApiResponse("Photo path is not save", -4001);
        }

        return photoPath;
    }
}