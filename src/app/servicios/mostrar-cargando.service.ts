import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MostrarCargandoService {

  constructor() { }

  valor: WritableSignal<boolean> = signal(false);

  cambiarEstado(valor:boolean) {
    this.valor.set(valor)
  }

  obtenerEstado(){
    return this.valor();
  }
}
