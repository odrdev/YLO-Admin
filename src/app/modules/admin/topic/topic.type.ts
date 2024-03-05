import { iPagination } from "../global.type";

export interface iTopicList
{
    id: number;
    title?: string;
    description?: string;
    tags?: string;
    version?:number
    isPublished?: boolean;
    topic_order?:number
    guid?: string;
}

export interface iTopic
{
    id: number;
    title?: string;
    description?: string;
    tags?: string;
    version?:number
    isPublished?: boolean;
    topic_order?:number
    guid?: string;
}

export interface iTopicResult
{
    Pagination: iPagination,
    result: iTopicList[]
}
