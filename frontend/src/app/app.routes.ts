import { Routes } from '@angular/router';
import { FormPageComponent } from '../form-page/form-page.component';
import { LoginPageComponent } from '../login-page/login-page.component';
import { authGuard } from '../authGuard';
import { SignUpPageComponent } from '../sign-page/sign-page.component';
import { FormViewComponent } from '../form-view/form-view.component';

export const routes: Routes = [
    { path : '', redirectTo: '/login', pathMatch:'full'},
    { path: 'login', component: LoginPageComponent },
    { path: 'signup', component: SignUpPageComponent },
    { path: 'form', component: FormPageComponent, canActivate: [authGuard] },
    { path: 'forms', component: FormViewComponent, canActivate: [authGuard]}
    
];
