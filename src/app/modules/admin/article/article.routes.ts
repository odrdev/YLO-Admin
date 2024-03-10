import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { ArticleRouter } from './article-router.component';
import { ArticleComponent } from './article.component';
import { ArticleService } from './article.services';
import { LawService } from '../law/law.services';

// export const ArticleResolver: ResolveFn<any> = (
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot,
//   ) => {
//     return inject(ArticleService).getListPaging("",0,10,"title","asc");
//   };
  export const LawResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(LawService).getList();
  };

export default [
    {
        path      : '',
        pathMatch : 'full',
        component: ArticleRouter,
        children : [
            {
                path     : '',
                component: ArticleComponent,
                resolve  : {Laws:LawResolver},
            },
        ],
    }
] as Routes;
