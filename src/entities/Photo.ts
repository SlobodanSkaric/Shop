import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Article } from "./Article";

@Index("uq_photo_image_path", ["imagePath"], { unique: true })
@Index("fk_photo_articel_id", ["articelId"], {})
@Entity("photo")
export class Photo {
  @PrimaryGeneratedColumn({ type: "int", name: "photo_id", unsigned: true })
  photoId: number;

  @Column("int", { name: "articel_id", unsigned: true, default: () => "'0'" })
  articelId: number;

  @Column("varchar", {
    name: "image_path",
    unique: true,
    length: 128,
    default: () => "'0'",
  })
  imagePath: string;

  @ManyToOne(() => Article, (article) => article.photos, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "articel_id", referencedColumnName: "articleId" }])
  articel: Article;
}
