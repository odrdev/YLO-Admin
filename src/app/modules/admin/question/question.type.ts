import { iPagination } from "../global.type";

export interface iQuestionList
{
    id: number;
    description: string;
    explanation: string;
    answer: boolean;
}

export interface iQuestion
{
    id: number;
    description: string;
    explanation: string;
    answer: boolean;
}

export interface iQuestionResult
{
    Pagination: iPagination,
    result: iQuestionList[]
}
