
import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EncabezadoComponent } from './componentes/compartidos/encabezado/encabezado.component';
import { HorizontalPrincipalComponent } from './componentes/compartidos/horizontal-principal/horizontal-principal.component';
import { MostrarEncabezadoServicieService } from './servicios/mostrar-encabezado-servicie.service';
import { Location } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { CargandoComponent } from "./componentes/compartidos/cargando/cargando.component";
import { MostrarCargandoService } from './servicios/mostrar-cargando.service';
import { ModalErrorComponent } from "./componentes/compartidos/modal-error/modal-error.component";
import { ErrorServicesService } from './servicios/error.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EncabezadoComponent, HorizontalPrincipalComponent, CargandoComponent, ModalErrorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('fade', [
      transition(':enter', [ // al aparecer
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [ // al desaparecer
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  estado = true
  mostrarCargando = false
  mostrarError = false
  private mostrarCargadoService = inject(MostrarCargandoService)
  private mostrarErrorService = inject(ErrorServicesService)

  constructor(private serviciceEncabezado : MostrarEncabezadoServicieService, private location: Location){
    effect(() => {
      this.estado = this.serviciceEncabezado.obtenerEstado();
    }); 

    effect(() =>{
      this.mostrarCargando = this.mostrarCargadoService.obtenerEstado()
    })

    effect(() =>{

     this.mostrarErrorService.obtenerEstado().subscribe((data)=>{
         this.mostrarError = data
     })
    })

  }

  ngOnInit(): void {
   
  }
  
  


}
