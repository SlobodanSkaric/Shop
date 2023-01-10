import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Article } from "./Article";
import * as Validator from "class-validator";

@Index("fk_articel_price_article_id", ["articleId"], {})
@Entity("article_price")
export class ArticlePrice {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "article_price_id",
    unsigned: true,
  })
  articlePriceId: number;

  @Column("int", { name: "article_id", unsigned: true, default: () => "'0'" })
  articleId: number;

  @Column("decimal", {
    name: "price",
    unsigned: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2
  })
  @Validator.IsPositive()
  price: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => Article, (article) => article.articlePrices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "articleId" }])
  article: Article;
}
