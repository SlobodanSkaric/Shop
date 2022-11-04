import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Article } from "entities/Article";
import { Repository } from "typeorm/repository/Repository";

@Injectable()
export class ArticleService extends TypeOrmCrudService<Article>{
    constructor(@InjectRepository(Article) private readonly article: Repository<Article>){
        super(article);
    }
}