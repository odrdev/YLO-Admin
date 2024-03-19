import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { FolderRouter } from './folder-router.component';
import { FolderComponent } from './folder.component';
import { FolderService } from './folder.services';

export const folderResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(FolderService).getListPaging("",0,10,"folder_order","asc");
  };
export default [
    {
        path      : '',
        pathMatch : 'full',
        component: FolderRouter,
        children : [
            {
                path     : '',
                component: FolderComponent,
                resolve  : {folders:folderResolver},
            },
        ],
    }
] as Routes;
