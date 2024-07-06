import { iPagination } from "../global.type";

export interface iQuizList
{
    id: number;
    description: string;
    title: string;
    items: number;
}

export interface iQuiz
{
    id: number;
    description: string;
    title: string;
    items: number;
}

export interface iQuizResult
{
    Pagination: iPagination,
    result: iQuizList[]
}
