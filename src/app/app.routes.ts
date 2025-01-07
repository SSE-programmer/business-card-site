import { Routes } from '@angular/router';
import { _pagesRoutes } from './pages/_pages.routes';

export const routes: Routes = [
    ..._pagesRoutes,
    {
        path: '**', loadComponent: () =>
            import('./pages/page-not-found/page-not-found.component')
                .then(m => m.PageNotFoundComponent)
    }
];
