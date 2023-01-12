import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.congiguration';
import { MailConfig } from 'config/mail.config';
import { Administrator } from 'src/entities/Administrator';
import { ArticelFeature } from 'src/entities/ArticelFeature';
import { Article } from 'src/entities/Article';
import { ArticlePrice } from 'src/entities/ArticlePrice';
import { Cart } from 'src/entities/Cart';
import { CartArticel } from 'src/entities/CartArticel';
import { Category } from 'src/entities/Category';
import { Feature } from 'src/entities/Feature';
import { Order } from 'src/entities/Order';
import { Photo } from 'src/entities/Photo';
import { User } from 'src/entities/User';
import { UserToken } from 'src/entities/UserToken';
import { AdministratorController } from './controllers/api/administrator.controller';
import { AdminstratorOrderController } from './controllers/api/administrator.order.controller';
import { ArticleController } from './controllers/api/article.controller';
import { AuthController } from './controllers/api/auth.controller';
import { CategoryController } from './controllers/api/category.controller';
import { FeatureController } from './controllers/api/feature.controller';
import { UserCartController } from './controllers/api/user.cart.controller';
import { AppController } from './controllers/app.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { AdministratorService } from './services/administrator/administrator.service';
import { ArticleService } from './services/article/article.service';
import { CartService } from './services/cart/cart.service';
import { CategoryService } from './services/category/category.service';
import { FeatureService } from './services/feature/feature.service';
import { OrderMailerService } from './services/order/order.mailer.service';
import { OrderService } from './services/order/order.service';
import { PhotoService } from './services/photo/photo.service';
import { UserService } from './services/user/user.service';

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
      Photo,
      User,
      Cart,
      CartArticel,
      Order
    ]),
    MailerModule.forRoot({
      transport: "smtps://" + MailConfig.username + ":" + MailConfig.password + "@" + MailConfig.hostname,
      defaults: MailConfig.senderEmail
    })
  ],
  controllers: [
    AppController,
    AdministratorController,
    CategoryController,
    ArticleController,
    AuthController,
    FeatureController,
    UserCartController,
    AdminstratorOrderController
  ],
  providers: [
    AdministratorService,
    CategoryService,
    ArticleService,
    PhotoService,
    FeatureService,
    UserService,
    CartService,
    OrderService,
    OrderMailerService
  ],
  exports: [
    AdministratorService,
    UserService,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude("auth/*").forRoutes("api/*")
  }
}
