import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { AuthController } from './controllers/api/auth.controller';
import { CategoryController } from './controllers/api/category.controller';
import { AppController } from './controllers/app.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { AdministratorService } from './services/administrator/administrator.service';
import { ArticleService } from './services/article/article.service';
import { CategoryService } from './services/category/category.service';
import { PhotoService } from './services/photo/photo.service';

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
      Article,
      ArticlePrice,
      Feature,
      ArticelFeature,
      Photo
    ])
  ],
  controllers: [
    AppController,
    AdministratorController,
    CategoryController,
    ArticleController,
    AuthController
  ],
  providers: [
    AdministratorService,
    CategoryService,
    ArticleService,
    PhotoService
  ],
  exports: [
    AdministratorService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude("auth/*").forRoutes("api/*")
  }
}
