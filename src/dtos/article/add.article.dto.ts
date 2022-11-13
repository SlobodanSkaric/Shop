export class AddArticleDto{
    name: string;
    categoryId: number;
    excerpt: string;
    description: string;
    price: number;
    features: {
        featuresId: number;
        value: string;
    }[];
}