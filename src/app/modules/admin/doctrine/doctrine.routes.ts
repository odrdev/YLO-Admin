import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { DoctrineRouter } from './doctrine-router.component';
import { DoctrineComponent } from './doctrine.component';
import { DoctrineService } from './doctrine.services';
import { TopicService } from '../topic/topic.services';

export const DoctrineResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(DoctrineService).getListPaging("",0,10,"details","asc");
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
        component: DoctrineRouter,
        children : [
            {
                path     : '',
                component: DoctrineComponent,
                resolve  : {Doctrines:DoctrineResolver,Topics:TopicResolver},
            },
        ],
    }
] as Routes;
