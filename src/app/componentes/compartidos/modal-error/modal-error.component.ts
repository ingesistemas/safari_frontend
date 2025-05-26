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
      this.mostrarErrorService.obtenerMensaje().subscribe((data)=>{
        this.mensaje = data
      })
    })
   }

    showDialog() {
        this.visible = !this.visible;
    }

}
