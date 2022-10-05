import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Article } from "./Article";
import { Feature } from "./Feature";

@Index("uq_articel_feature_article_id_feature_id", ["articleId", "featureId"], {
  unique: true,
})
@Index("fk_atricle_feature_feature_id", ["featureId"], {})
@Entity("articel_feature")
export class ArticelFeature {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "articel_feature_id",
    unsigned: true,
  })
  articelFeatureId: number;

  @Column("int", { name: "article_id", unsigned: true, default: () => "'0'" })
  articleId: number;

  @Column("int", { name: "feature_id", unsigned: true, default: () => "'0'" })
  featureId: number;

  @Column("varchar", { name: "value", length: 255, default: () => "'0'" })
  value: string;

  @ManyToOne(() => Article, (article) => article.articelFeatures, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "articleId" }])
  article: Article;

  @ManyToOne(() => Feature, (feature) => feature.articelFeatures, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "feature_id", referencedColumnName: "featureId" }])
  feature: Feature;
}
