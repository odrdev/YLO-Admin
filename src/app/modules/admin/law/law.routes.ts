import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { LawRouter } from './law-router.component';
import { LawComponent } from './law.component';
import { LawService } from './law.services';
import { FolderService } from '../folder/folder.services';

export const LawResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(LawService).getListPaging("",0,10,"title","asc");
  };
  export const FolderResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(FolderService).getList();
  };
export default [
    {
        path      : '',
        pathMatch : 'full',
        component: LawRouter,
        children : [
            {
                path     : '',
                component: LawComponent,
                resolve  : {Laws:LawResolver,Folders:FolderResolver},
            },
        ],
    }
] as Routes;
