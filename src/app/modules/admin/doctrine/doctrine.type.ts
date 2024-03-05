import { iPagination } from "../global.type";

export interface iDoctrineList
{
    id: number;
    title?: string;
    description?: string;
    tags?: string;
    version?:number
    isPublished?: boolean;
    doctrine_order?:number
    guid?: string;
}

export interface iDoctrine
{
    id: number;
    title?: string;
    description?: string;
    tags?: string;
    version?:number
    isPublished?: boolean;
    doctrine_order?:number
    guid?: string;
}

export interface iDoctrineResult
{
    Pagination: iPagination,
    result: iDoctrineList[]
}
