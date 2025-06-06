import { Routes } from '@angular/router';
import { ListarUsuariosComponent } from './listar-usuarios/listar-usuarios.component';
import { CambiarClaveComponent } from './cambiar-clave/cambiar-clave.component';
import { AutenticadoGuard } from '../../guards/auntenticado.guard';
import { IngresarComponent } from './ingresar/ingresar.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { EditarUsuariosRolComponent } from './editar-usuarios-rol/editar-usuarios-rol.component';



export const usuariosRoutes: Routes = [
  {
    path: '',
    component: IngresarComponent,
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
    path: 'editar-usuario-rol',
    component: EditarUsuariosRolComponent
  },
  {
    path: 'crear-usuario',
    component: CrearUsuarioComponent,
  },
  {
    path: 'listar-usuarios',
    component: ListarUsuariosComponent,
    canMatch:[
      AutenticadoGuard
    ]
  },
  {
    path: '**',
    component: IngresarComponent
  }
];