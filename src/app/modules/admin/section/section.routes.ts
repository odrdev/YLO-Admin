import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { SectionRouter } from './section-router.component';
import { SectionComponent } from './section.component';
import { SectionService } from './section.services';
import { ArticleService } from '../article/article.services';
import { LawService } from '../law/law.services';

export const ArticleResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(ArticleService).getList();
  };
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
        component: SectionRouter,
        children : [
            {
                path     : '',
                component: SectionComponent,
                resolve  : {Articles:ArticleResolver,Laws:LawResolver},
            },
        ],
    }
] as Routes;
