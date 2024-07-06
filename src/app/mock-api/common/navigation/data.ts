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
        icon : 'heroicons_outline:list-bullet',
        link : '/law'
    },
    {
        id   : 'm1-1',
        title: 'Articles',
        type : 'basic',
        icon : 'heroicons_outline:newspaper',
        link : '/article'
    },
    {
        id   : 'm1-2',
        title: 'Sections',
        type : 'basic',
        icon : 'heroicons_outline:document-text',
        link : '/section'
    },
    {
        id   : 'm2',
        title: 'Topics',
        type : 'basic',
        icon : 'heroicons_outline:queue-list',
        link : '/topic'
    },
    {
        id   : 'm3',
        title: 'Doctrines',
        type : 'basic',
        icon : 'heroicons_outline:sparkles',
        link : '/doctrine'
    },
    {
        id   : 'm6',
        title: 'Questions',
        type : 'basic',
        icon : 'heroicons_outline:square-3-stack-3d',
        link : '/question'
    },
    {
        id   : 'm7',
        title: 'Quizzes',
        type : 'basic',
        icon : 'heroicons_outline:square-3-stack-3d',
        link : '/quiz'
    },
    {
        id   : 'm4',
        title: 'Users',
        type : 'basic',
        icon : 'heroicons_outline:user-group',
        link : '/user'
    },
    {
        id   : 'm5',
        title: 'Settings',
        type : 'basic',
        icon : 'heroicons_outline:cog',
        link : '/settings'
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
