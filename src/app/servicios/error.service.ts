import { inject, Injectable, signal, WritableSignal  } from '@angular/core';

import { SonidosService } from './sonidos.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorServicesService {

  constructor() { }

  //valor: WritableSignal<boolean> = signal(false);

  private sonidoService = inject(SonidosService)
  valor: WritableSignal<boolean> = signal(false);
  mensaje: WritableSignal<string> = signal('');

  cambiarEstado(valor:boolean, mensaje: string) {
    if(valor){
      this.sonidoService.playSound('alert')
    }
    this.valor.set(valor)
    this.mensaje.set(mensaje)
  }

  obtenerEstado(){
    return this.valor();
  }

  obtenerMensaje(){
    return this.mensaje();
  }
}
