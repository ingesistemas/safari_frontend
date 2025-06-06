import { computed, inject, Injectable, signal } from '@angular/core';
import { Rol } from '../interfaces/IRol.interface';
import { Usuario } from '../interfaces/IUsuarios.interface';
import { HttpClient } from '@angular/common/http';

type EstadoUsuario = 'Inicial' | 'Autenticado' | 'Sin-Autenticar'

@Injectable({
  providedIn: 'root'
})
export class AutenticaService {

  private _estadoUsuario = signal<EstadoUsuario>('Inicial')
  private _usuario = signal<Usuario|null>(null)
  private _token = signal<string|null>(null)

  private _http = inject(HttpClient)

  estadoActualUsuario = computed<EstadoUsuario>(() =>{
    if (this._estadoUsuario() === 'Inicial') return 'Inicial'
    if (this._usuario()){
      return 'Autenticado'
    }
    return 'Sin-Autenticar'
  })

  actualizarEstados(valor: boolean, datos: any, token:string|''){
    if(valor == true){
      this._estadoUsuario.set('Autenticado')
      this._usuario.set(datos)
      this._token.set(token)
    }else{
      this._estadoUsuario.set('Sin-Autenticar')
      this._usuario.set({id: 0, usuario: '', email: '', celular: '', activo: '', id_rol: '', emailCreador:'', roles: {id:'', rol:'', activo: ''}})
      this._token.set('')
    }
  }

  usuarioActual = computed<Usuario|null>(() => this._usuario())
  tokenActual = computed<string|null>(() => this._token())
  estadoActual = computed<EstadoUsuario>(() => this._estadoUsuario())
}
