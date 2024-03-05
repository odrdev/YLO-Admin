import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { ContentRouter } from './content-router.component';
import { ContentComponent } from './content.component';
import { ContentService } from './content.services';

export const ContentResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(ContentService).getListPaging("",0,10,"title","asc");
  };
export default [
    {
        path      : '',
        pathMatch : 'full',
        component: ContentRouter,
        children : [
            {
                path     : '',
                component: ContentComponent,
                resolve  : {Contents:ContentResolver},
            },
        ],
    }
] as Routes;
