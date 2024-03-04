import { iPagination } from "../global.type";

export interface iFolderList
{
    id: number;
    name?: string;
    folder_order?: number;
    version?: number;
    isPublished?: boolean;
    guid?: string;
}

export interface iFolder
{
    id: number;
    name?: string;
    folder_order?: number;
    version?: number;
    isPublished?: boolean;
    guid?: string;
}

export interface iFolderResult
{
    Pagination: iPagination,
    result: iFolderList[]
}
