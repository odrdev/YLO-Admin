import { Routes } from '@angular/router';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import { NoaccessComponent } from './noaccess.component';

export default [
    {
        path     : '',
        component: NoaccessComponent,
    },
] as Routes;
