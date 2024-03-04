import { iPagination } from "../global.type";

export interface iLawList
{
    id: number;
    title?: string;
    subtitle?: string;
    description?: string;
    tags?: string;
    version?:number
    isPublished?: boolean;
    guid?: string;
}

export interface iLaw
{
    id: number;
    title?: string;
    subtitle?: string;
    description?: string;
    tags?: string;
    version?:number
    isPublished?: boolean;
    guid?: string;
}

export interface iLawResult
{
    Pagination: iPagination,
    result: iLawList[]
}
