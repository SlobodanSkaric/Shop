import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ArticelFeature } from "./ArticelFeature";
import { Category } from "./Category";
import { ArticlePrice } from "./ArticlePrice";
import { CartArticel } from "./CartArticel";
import { Photo } from "./Photo";
import { Feature } from "./Feature";
import * as Validator from "class-validator";
import { ArticleStatus } from "src/types/article.status.enum";

@Index("fk_article_category_id", ["categoryId"], {})
@Entity("article")
export class Article {
  @PrimaryGeneratedColumn({ type: "int", name: "article_id", unsigned: true })
  articleId: number;

  @Column("varchar", { name: "name", length: 128, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(5,128)
  name: string;

  @Column("int", { name: "category_id", unsigned: true, default: () => "'0'" })
  categoryId: number;

  @Column("varchar", { name: "excerpt", length: 255, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(10,128)
  excerpt: string;

  @Column("text", { name: "description" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(64,10000)
  description: string;

  @Column("enum", {
    name: "status",
    enum: ["available", "visible", "hidden"],
    default: () => "'available'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  //@Validator.IsEnum(ArticleStatus)
  @Validator.IsIn(["available", "visible", "hidden"])
  status: "available" | "visible" | "hidden";

  @Column("tinyint", {
    name: "is_promoted",
    unsigned: true,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsIn([0,1])
  isPromoted: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => ArticelFeature, (articelFeature) => articelFeature.article)
  articelFeatures: ArticelFeature[];

  @ManyToOne(() => Category, (category) => category.articles, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @OneToMany(() => ArticlePrice, (articlePrice) => articlePrice.article)
  articlePrices: ArticlePrice[];

  @ManyToMany(type => Feature, feature => feature.article)
  @JoinTable({
    name: "articel_feature",
    joinColumn: { name: "article_id", referencedColumnName: "articleId"},
    inverseJoinColumn: {name: "feature_id", referencedColumnName: "featureId"}
  })
  features: Feature[];

  @OneToMany(() => CartArticel, (cartArticel) => cartArticel.articel)
  cartArticels: CartArticel[];

  @OneToMany(() => Photo, (photo) => photo.articel)
  photos: Photo[];
}
