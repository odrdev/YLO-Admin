import { iPagination } from "../global.type";

export interface iUserList
{
    id: number;
    username: string;
    email:string;
}

export interface iUser
{
    id: number;
    username: string;
    email:string;
}

export interface iUserResult
{
    Pagination: iPagination,
    result: iUserList[]
}
