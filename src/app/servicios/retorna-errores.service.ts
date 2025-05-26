import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RetornaErroresService {


  getErrores(form: FormGroup, campo: string): string | null {
    const control = form.get(campo);

    if (!control || !control.errors) return null;

    const errores = control.errors;

    for (const key of Object.keys(errores)) {
      switch (key) {
        case 'required':
          return 'El campo es requerido.';
        case 'email':
          return 'El formato del correo no es válido.';
        case 'minlength':
          return `Mínimo ${errores['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `Máximo ${errores['maxlength'].requiredLength} caracteres.`;
        case 'pattern':
          return `Verifica, pues se ha presentado un error en el formato.`;
      }
    }

    return null;
  }
}
