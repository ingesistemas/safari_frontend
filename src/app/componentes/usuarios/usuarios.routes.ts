import { Routes } from '@angular/router';
import { ListarUsuariosComponent } from './listar-usuarios/listar-usuarios.component';
import { CambiarClaveComponent } from './cambiar-clave/cambiar-clave.component';
import { AutenticadoGuard } from '../../guards/auntenticado.guard';
import { IngresarComponent } from './ingresar/ingresar.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';



export const usuariosRoutes: Routes = [
  {
    path: '',
    component: ListarUsuariosComponent,
    canMatch:[
      AutenticadoGuard
    ]
  },
  {
    path: 'ingresar',
    component: IngresarComponent
  },
  {
    path: 'editar-clave',
    component: CambiarClaveComponent,
    canMatch:[
      AutenticadoGuard
    ]
  },
  {
    path: 'editar-usuario',
    component: EditarUsuarioComponent,
    canMatch:[
      AutenticadoGuard
    ]
  },
  {
    path: '**',
    component: ListarUsuariosComponent
  }
];