import { iPagination } from "../global.type";

export interface iArticleList
{
    id: number;
    title?: string;
    subtitle?: string;
    description?: string;
    tags?: string;
    version?:number
    isPublished?: boolean;
    guid?: string;
    lawGUID?:string;
    article_order?:number;
}

export interface iArticle
{
    id: number;
    title?: string;
    subtitle?: string;
    description?: string;
    tags?: string;
    version?:number
    isPublished?: boolean;
    guid?: string;
    lawGUID?:string;
    article_order?:number;
}

export interface iArticleResult
{
    Pagination: iPagination,
    result: iArticleList[]
}
