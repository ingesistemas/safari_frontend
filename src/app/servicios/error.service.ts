import { inject, Injectable, signal, WritableSignal  } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SonidosService } from './sonidos.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorServicesService {

  constructor() { }

  //valor: WritableSignal<boolean> = signal(false);
  private valor = new BehaviorSubject<boolean>(false);
  private mensaje = new BehaviorSubject<string>('');
  private sonidoService = inject(SonidosService)

  cambiarEstado(valor:boolean, mensaje: string) {
    if(valor){
      this.sonidoService.playSound('alert')
    }
    this.valor.next(valor)
    this.mensaje.next(mensaje)
    
  }

  obtenerEstado(){
    return this.valor.asObservable();
  }

  obtenerMensaje(){
    return this.mensaje.asObservable();
  }
}
