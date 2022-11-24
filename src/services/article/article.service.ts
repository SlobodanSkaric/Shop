import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { ArticelFeature } from "src/entities/ArticelFeature";
import { Article } from "src/entities/Article";
import { ArticlePrice } from "src/entities/ArticlePrice";
import { Feature } from "src/entities/Feature";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm/repository/Repository";

@Injectable()
export class ArticleService extends TypeOrmCrudService<Article>{
    constructor(
        @InjectRepository(Article) private readonly article: Repository<Article>,
        @InjectRepository(ArticlePrice) private readonly articelPrice: Repository<ArticlePrice>,
        @InjectRepository(ArticelFeature) private readonly articelFeature: Repository<ArticelFeature>
        ){
        super(article);
    }

    async createFullArticel(data: AddArticleDto): Promise<Article | ApiResponse>{
        let newArticle = new Article();
        newArticle.name = data.name;
        newArticle.categoryId = data.categoryId;
        newArticle.excerpt = data.excerpt;
        newArticle.description = data.description;

        let saveArticle = await this.article.save(newArticle);

        let newArticlePrice: ArticlePrice = new ArticlePrice();
        newArticlePrice.articleId = saveArticle.articleId;
        newArticlePrice.price = data.price;

        let saveArticlePrice = await this.articelPrice.save(newArticlePrice);

        for(let feature of data.features){
            let newArticleFeature: ArticelFeature = new ArticelFeature();
            newArticleFeature.articleId = saveArticle.articleId;
            newArticleFeature.featureId = feature.featuresId;
            newArticleFeature.value = feature.value;

            await this.articelFeature.save(newArticleFeature);
        }

        return await this.article.findOne({
            where: {
                articleId: saveArticle.articleId
            },
            relations: [
                "category",
                "articelFeatures",
                "features",
                "articlePrices"
            ]
        })
       
    }
}