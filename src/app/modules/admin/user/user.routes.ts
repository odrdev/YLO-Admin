import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouter } from './user-router.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { UserService } from './user.services';

export const UserResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(UserService).getListPaging("",0,10,"username","asc");
  };
export default [
    {
        path      : '',
        pathMatch : 'full',
        component: UserRouter,
        children : [
            {
                path     : '',
                component: UserComponent,
                resolve  : {User:UserResolver},
            },
        ],
    }
] as Routes;
