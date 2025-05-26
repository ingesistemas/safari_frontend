import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MostrarEncabezadoServicieService } from '../../../servicios/mostrar-encabezado-servicie.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AutenticaService } from '../../../servicios/autentica.service';

@Component({
  selector: 'app-horizontal-principal',
  imports: [RouterLink, RouterModule, RouterLinkActive, SplitButtonModule, ButtonModule],
  templateUrl: './horizontal-principal.component.html',
  styleUrl: './horizontal-principal.component.css'
})
export class HorizontalPrincipalComponent {
  items!: MenuItem[];
  emailActual: any
  estadoActual: string = ''
  
  private autenticaServicio = inject(AutenticaService)
  private router = inject(Router)

  constructor(private mostrarEncabezadoServicio: MostrarEncabezadoServicieService){

     effect(()=>{
      const email = this.autenticaServicio.usuarioActual()
      this.emailActual = email?.email
      const estado = this.autenticaServicio.estadoActual()
      this.estadoActual = estado
    })

    this.items = [
      {
          label: 'Mis datos personales',
          command: () => {
            this.router.navigateByUrl('/usuarios/editar-usuario')
          }
      },
      {
        label: 'Cambiar contraseña',
        command: () => {   
          this.router.navigateByUrl('/usuarios/editar-clave')
        }
      },
      { separator: true },
      { label: 'Cerrar sesión', 
        command: () => {
              this.cerrarSesion();
          }
      }
    ];

  }

  datosPersonales(){

  }

  cerrarSesion(){
      this.autenticaServicio.actualizarEstados(false, null, '')
      this.router.navigate(['/'])  
  }

  estado(estado: boolean){
    this.mostrarEncabezadoServicio.cambiarEstado(estado);
    const valor = (this.mostrarEncabezadoServicio.obtenerEstado());
  }

  obtenerDatoActuales(){
   
    alert(this.estadoActual)
  }

}
