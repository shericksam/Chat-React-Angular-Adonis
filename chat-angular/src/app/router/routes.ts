import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../componentes/home/home.component';

import { AppComponent } from '../components/app/app.component';

import { AuthorizatedGuard } from '../servicios/guard/authorizated.guard';
import { LoginComponent } from '../componentes/login/login.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent/*, canActivate: [ AuthorizatedGuard */ },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home'}
];
export const Routing = RouterModule.forRoot(appRoutes);