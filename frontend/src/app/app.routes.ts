import { Routes } from '@angular/router';
import { FormPageComponent } from '../form-page/form-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/form', pathMatch: 'full' }, // Redirect root path to /form
    { path: 'form', component: FormPageComponent },
    { path: '**', redirectTo: '/form' } // Wildcard route for unknown paths
];
