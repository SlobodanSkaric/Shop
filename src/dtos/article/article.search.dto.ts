import * as Validator from "class-validator";
import { ArticelSearchFeatureDto } from "./articel.search.feature.dto";

export class ArticelSearchDto{

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity:false,
        allowNaN: false,
        maxDecimalPlaces: 0
    })
    categoryId: number;


    @Validator.IsOptional()
    @Validator.IsString()
    @Validator.Length(2,128)
    keywords: string;


    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity:false,
        allowNaN: false,
        maxDecimalPlaces: 2
    })
    priceMin: number;


    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity:false,
        allowNaN: false,
        maxDecimalPlaces: 2
    })
    priceMax: number;

    features: ArticelSearchFeatureDto[];

    @Validator.IsOptional()
    @Validator.IsIn(["name", "price"])
    orderBy: "name" | "price";

    @Validator.IsOptional()
    @Validator.IsIn(["ASC", "DESC"])
    orderdirection: "ASC" | "DESC";

    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0
    })   
    @Validator.IsPositive()
    page: number;

    @Validator.IsOptional()
    @Validator.IsPositive()
    @Validator.IsIn([5,10,25,50])
    itemsPrePage: 5 | 10 | 25 | 50;
}