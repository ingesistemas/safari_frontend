import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { IngresarComponent } from './componentes/usuarios/ingresar/ingresar.component';
import { ContactosComponent } from './componentes/contactos/contactos.component';
import { AutenticadoGuard } from './guards/auntenticado.guard';
import { CambiarClaveComponent } from './componentes/usuarios/cambiar-clave/cambiar-clave.component';
import { usuariosRoutes } from './componentes/usuarios/usuarios.routes';


export const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
    canMatch:[
      AutenticadoGuard
    ]
  },
  {
    path: 'usuarios',
    children: usuariosRoutes
  },
  
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'contactos',
    component: ContactosComponent,
    canMatch:[
      AutenticadoGuard
    ]
  },
  {
    path: '**',
    component: InicioComponent
  }
];
