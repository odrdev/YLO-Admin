import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { TopicRouter } from './topic-router.component';
import { TopicComponent } from './topic.component';
import { TopicService } from './topic.services';
import { ContentComponent } from '../content/content.component';

export const TopicResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(TopicService).getListPaging("",0,10,"title","asc");
  };
export default [
    {
        path      : '',
        pathMatch : 'full',
        component: TopicRouter,
        children : [
            {
                path     : '',
                component: TopicComponent,
                resolve  : {Topics:TopicResolver},
            },
        ],
    }
] as Routes;
