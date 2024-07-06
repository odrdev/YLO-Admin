import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { QuestionRouter } from './question-router.component';
import { QuestionComponent } from './question.component';
import { QuestionService } from './question.services';
import { TopicService } from '../topic/topic.services';

export const QuestionResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(QuestionService).getListPaging("",0,10,"id","asc");
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
        component: QuestionRouter,
        children : [
            {
                path     : '',
                component: QuestionComponent,
                resolve  : {Questions:QuestionResolver,Topics:TopicResolver},
            },
        ],
    }
] as Routes;
