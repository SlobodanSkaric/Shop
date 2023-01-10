import * as Validator from "class-validator";
import { ArticleFeatureCompnent } from "./articel.feature.component.dto";

export class EditArticleDto{
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(5,128)
    name: string;

    categoryId: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(10,128)
    excerpt: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(64,10000)
    description: string;


    status: 'available'| 'visible' | 'hidden';


    isPromoted: 0 | 1;

    @Validator.IsNotEmpty()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2
    })
    @Validator.IsPositive()
    price: number;

    @Validator.IsOptional()
    @Validator.IsArray()
    @Validator.ValidateNested({
        always: true
    })
    features: ArticleFeatureCompnent[] | null;
}