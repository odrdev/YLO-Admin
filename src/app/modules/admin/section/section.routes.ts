import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { SectionRouter } from './section-router.component';
import { SectionComponent } from './section.component';
import { SectionService } from './section.services';

export const SectionResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(SectionService).getListPaging("",0,10,"title","asc");
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
                resolve  : {Sections:SectionResolver},
            },
        ],
    }
] as Routes;
