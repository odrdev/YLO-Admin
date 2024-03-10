/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'd1',
        title: 'divider',
        type : 'divider',
        icon : 'heroicons_outline:chart-pie',
    },
    {
        id   : 'm0',
        title: 'Folders',
        type : 'basic',
        icon : 'heroicons_outline:folder',
        link : '/folder'
    },
    {
        id   : 'm1',
        title: 'Laws',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/law'
    },
    {
        id   : 'm1-1',
        title: 'Articles',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/article'
    },
    {
        id   : 'm1-2',
        title: 'Sections',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/section'
    },
    {
        id   : 'm2',
        title: 'Topics',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/topic'
    },
    {
        id   : 'm3',
        title: 'Doctrines',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/doctrine'
    },
    {
        id   : 'm4',
        title: 'Users',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/user'
    },
    {
        id   : 'm5',
        title: 'Settings',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/settings'
    },
    {
        id   : 'm6',
        title: 'Quizes',
        type : 'basic',
        icon : 'heroicons_outline:wrench-screwdriver',
        link : '/quiz'
    },

];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
