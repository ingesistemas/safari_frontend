import { Component, effect, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ErrorServicesService } from '../../../servicios/error.service';

@Component({
  selector: 'app-modal-error',
  imports: [DialogModule],
  templateUrl: './modal-error.component.html',
  styleUrl: './modal-error.component.css'
})
export class ModalErrorComponent {
  mensaje: string = ''
  visible: boolean = true
   private mostrarErrorService = inject(ErrorServicesService)

   constructor(){
    effect(() =>{
      this.mensaje = this.mostrarErrorService.obtenerMensaje()
    })
   }

    showDialog() {
        this.visible = !this.visible;
    }

    cerrar(){
      this.mostrarErrorService.cambiarEstado(false, '');
    }

}
