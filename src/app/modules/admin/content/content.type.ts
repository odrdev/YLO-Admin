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
    lawGuid?:string;
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
    lawGuid?:string;
    article_order?:number;
}

export interface iArticleResult
{
    Pagination: iPagination,
    result: iArticleList[]
}
export interface iSectionList
{
    id: number;
    title?: string;
    subtitle?: string;
    description?: string;
    tags?: string;
    version?:number
    isPublished?: boolean;
    guid?: string;
    articleGuid?:string;
    section_order?:number;
}

export interface iSection
{
    id: number;
    title?: string;
    subtitle?: string;
    description?: string;
    tags?: string;
    version?:number
    isPublished?: boolean;
    guid?: string;
    articleGuid?:string;
    section_order?:number;
}

export interface iSectionResult
{
    Pagination: iPagination,
    result: iSectionList[]
}