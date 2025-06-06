import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MostrarEncabezadoServicieService } from '../../../servicios/mostrar-encabezado-servicie.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AutenticaService } from '../../../servicios/autentica.service';
import { HttpClient } from '@angular/common/http';

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
      const usuarioActual = this.autenticaServicio.usuarioActual()
      this.emailActual = usuarioActual?.email
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
  private http = inject(HttpClient)
  atenea() {
    const body = {
      agentId: -1,
      userId: 33,
      date1: "01-11-2024",
      date2: "17-11-2024"
    };

    this.http.post('https://nabuapi.atenea.ai/api/nabu/downloadReport', body, {
      responseType: 'blob',
       headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvbmFidWFwaS5hdGVuZWEuYWlcL2FwaVwvbmFidVwvYXV0aCIsImlhdCI6MTc0ODUzNjYzMiwiZXhwIjoxNzQ4NzA5NDMyLCJuYmYiOjE3NDg1MzY2MzIsImp0aSI6ImlCSTR2VzZlY1k4dTF0ZlgiLCJzdWIiOjQzLCJwcnYiOiI0YTI2NTMzYmU1NGE0Y2Q0YmZmZDJhMjg4MTMwMWI4MWE2OTg3YjQ0In0.u0GhXcCNeojpU7xCeyLd3esJ0YNgzyjp0m9L1wBfpj8`,
        Accept: 'application/json'
      }
    }).subscribe((response: Blob) => {
      if (response.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result as string;
          console.log('⚠️ Respuesta JSON del servidor:', JSON.parse(text));
        };
        reader.readAsText(response);
        return;
      }

      // Solo si es Excel
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);
    });
  
  }
}
