import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { QuizRouter } from './quiz-router.component';
import { QuizComponent } from './quiz.component';
import { QuizService } from './quiz.services';
import { TopicService } from '../topic/topic.services';

export const QuizResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(QuizService).getListPaging("",0,10,"id","asc");
  };
  export const TopicResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(TopicService).getList();
  };
export default [
    {
        path      : '',
        pathMatch : 'full',
        component: QuizRouter,
        children : [
            {
                path     : '',
                component: QuizComponent,
                resolve  : {Quizs:QuizResolver,Topics:TopicResolver},
            },
        ],
    }
] as Routes;
