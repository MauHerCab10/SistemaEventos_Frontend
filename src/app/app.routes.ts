import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { autenticacionGuard } from './seguridad/autenticacion.guard';
import { EventoComponent } from './pages/evento/evento.component';

export const routes: Routes = [
    {path: "", component:LoginComponent}, /* http://localhost:4200/ */
    {path: "login", component:LoginComponent},
    {path: "registro", component:RegistroComponent},
    {path: "inicio", component:EventoComponent, canActivate:[autenticacionGuard]}
];
