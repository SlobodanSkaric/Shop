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
import { Article } from "./Article";
import { Category } from "./Category";

@Index("uq_feature_name_category_id", ["name", "categoryId"], { unique: true })
@Index("fk_feature_category_id", ["categoryId"], {})
@Entity("feature")
export class Feature {
  @PrimaryGeneratedColumn({ type: "int", name: "feature_id", unsigned: true })
  featureId: number;

  @Column("varchar", { name: "name", length: 32, default: () => "'0'" })
  name: string;

  @Column("int", { name: "category_id", unsigned: true, default: () => "'0'" })
  categoryId: number;

  @OneToMany(() => ArticelFeature, (articelFeature) => articelFeature.feature)
  articelFeatures: ArticelFeature[];

  @ManyToOne(() => Category, (category) => category.features, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @ManyToMany(type => Article, article => article.features)
  @JoinTable({
    name: "articel_feature",
    joinColumn: { name: "feature_id", referencedColumnName: "featureId"},
    inverseJoinColumn: {name: "article_id", referencedColumnName: "articleId"}
  })
  article: Article[];
}
