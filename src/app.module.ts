import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.congiguration';
import { Administrator } from 'entities/Administrator';
import { ArticelFeature } from 'entities/ArticelFeature';
import { Article } from 'entities/Article';
import { ArticlePrice } from 'entities/ArticlePrice';
import { Cart } from 'entities/Cart';
import { CartArticel } from 'entities/CartArticel';
import { Category } from 'entities/Category';
import { Feature } from 'entities/Feature';
import { Order } from 'entities/Order';
import { Photo } from 'entities/Photo';
import { User } from 'entities/User';
import { UserToken } from 'entities/UserToken';
import { AdministratorController } from './controllers/api/administrator.controller';
import { ArticleController } from './controllers/api/article.controller';
import { CategoryController } from './controllers/api/category.controller';
import { AppController } from './controllers/app.controller';
import { AdministratorService } from './services/administrator/administrator.service';
import { ArticleService } from './services/article/article.service';
import { CategoryService } from './services/category/category.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.dbname,
      entities: [
        Administrator,
        ArticelFeature,
        Article,
        ArticlePrice,
        Cart,
        CartArticel,
        Category,
        Feature,
        Order,
        Photo,
        User,
        UserToken
      ]
    }),
    TypeOrmModule.forFeature([
      Administrator,
      Category,
      Article
    ])
  ],
  controllers: [
    AppController,
    AdministratorController,
    CategoryController,
    ArticleController
  ],
  providers: [
    AdministratorService,
    CategoryService,
    ArticleService
  ]
})
export class AppModule {}
