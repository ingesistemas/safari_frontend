import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MostrarEncabezadoServicieService {

  constructor() { }

  valor: WritableSignal<boolean> = signal(true);

  cambiarEstado(valor:boolean) {
    this.valor.set(valor)
    }

  obtenerEstado(){
    return this.valor();
  }
}
