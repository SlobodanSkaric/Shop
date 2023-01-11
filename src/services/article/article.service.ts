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
import { EditArticleDto } from "src/dtos/article/edit.article.dot";
import { ArticelSearchDto } from "src/dtos/article/article.search.dto";
import { In } from "typeorm";

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

    async editFullArticle(articleId: number, data: EditArticleDto):Promise<Article | ApiResponse>{
        const article: Article = await this.article.findOne({where: {articleId: articleId},
            relations: ["articlePrices","articelFeatures"]
        });

        if(!article){
            return new ApiResponse("error", -5001, "Article is not found");
        }

        article.name = data.name;
        article.categoryId = data.categoryId;
        article.excerpt = data.excerpt;
        article.description = data.description;
        article.status = data.status;
        article.isPromoted = data.isPromoted;   

        const editarticel = await this.article.save(article);

        if(!editarticel){
            return new ApiResponse("error", -5002, "Edit not success");
        }

        const newPrice: string = Number(data.price).toFixed(2);
        const lastPrice: string = Number(article.articlePrices[article.articlePrices.length-1].price).toFixed(2);

        if(newPrice != lastPrice){
            const artPrice = new ArticlePrice();

            artPrice.articleId = articleId;
            artPrice.price = data.price;

            const saveArticlePrice = await this.articelPrice.save(artPrice);

            if(!saveArticlePrice){
                return new ApiResponse("error", -5003, "Not save article price");
            }
        }

        if(data.features !== null){
            await this.articelFeature.remove(article.articelFeatures);

            for(let feature of data.features){
                let newArticleFeature: ArticelFeature = new ArticelFeature();
                newArticleFeature.articleId = articleId;
                newArticleFeature.featureId = feature.featuresId;
                newArticleFeature.value = feature.value;
    
                await this.articelFeature.save(newArticleFeature);
            }
        }

        return await this.article.findOne({
            where: {
                articleId: articleId
            },
            relations: [
                "category",
                "articelFeatures",
                "features",
                "articlePrices"
            ]
        })
    }

    async searcArticel(data: ArticelSearchDto): Promise<Article[]>{
        const builder = await this.article.createQueryBuilder("article");

        builder.innerJoin("article.articlePrices", "ap", "ap.createdAt = (SELECT ap.created_at FROM article_price AS ap WHERE ap.article_id = article.article_id ORDER BY ap.created_at DESC LIMIT 1)");
        builder.leftJoin("article.articelFeatures", "af");

        builder.where("article.categoryId = :catId", {catId: data.categoryId});

        if(data.keywords && data.keywords.length > 0){
            builder.andWhere(`(
            article.name LIKE :kw OR
            article.description LIKE :kw OR
            article.excerpt LIKE :kw
            )
            `, {kw: "%" + data.keywords.trim() + "%"});
        }

        if(data.priceMin && typeof data.priceMin == "number"){
            builder.andWhere("ap.price >= :minPrice", {minPrice: data.priceMin});
        }

        if(data.priceMax && typeof data.priceMax == "number"){
            builder.andWhere("ap.price <= :maxPrice", {maxPrice: data.priceMax});
        }

        if(data.features && data.features.length > 0){
            for(const feature of data.features){
                builder.andWhere("af.featureId = :fId AND af.value IN (:fVals)", {
                    fId: feature.featuresId,
                    fVals: feature.values
                })
            }
        }
        
        let orderBy = "article.name";
        let orderDirection: "ASC" | "DESC" = "ASC";

        if(data.orderBy){
            orderBy = data.orderBy;

            if(data.orderBy == "price"){
                orderBy = "af.price";
            }
        }

        if(data.orderdirection){
            orderDirection = data.orderdirection;
        }

        builder.orderBy(orderBy, "ASC");
        let page = 0;
        let itemsPrePage: 5 | 10 | 25 | 50 = 25;

        if(typeof data.page === "number"){
            page = data.page;
        }

        if(typeof data.itemsPrePage === "number"){
            itemsPrePage = data.itemsPrePage;
        }

        builder.skip(page * itemsPrePage);
        builder.take(itemsPrePage);

        let articleIds = await (await (builder.getMany())).map(article => article.articleId);

        return await this.article.find({
            where: {
                articleId: In(articleIds),
            },
            relations:[
                "category",
                "articelFeatures",
                "features",
                "articlePrices"
            ]
        })
    }
}