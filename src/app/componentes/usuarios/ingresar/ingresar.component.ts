import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MostrarEncabezadoServicieService } from '../../../servicios/mostrar-encabezado-servicie.service';
import { PeticionServiceService } from '../../../servicios/peticion-service.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MostrarCargandoService } from '../../../servicios/mostrar-cargando.service';
import { ErrorServicesService } from '../../../servicios/error.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AutenticaService } from '../../../servicios/autentica.service';


export interface respuesta {
  Data: [],
  Mensaje: string,
  Error: boolean,
  Status: string,
  access_token?: string
}

@Component({
  selector: 'app-ingresar',
  imports: [RouterLink, ReactiveFormsModule, FloatLabelModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './ingresar.component.html',
  styleUrl: './ingresar.component.css',
  encapsulation: ViewEncapsulation.None
})
export class IngresarComponent{
  mensaje: string = ''
  
  constructor(
    private router: Router,
    private peticionService: PeticionServiceService,
    private messageService: MessageService
  ){}

  show() {
    this.messageService.add({ severity: 'success', summary: 'Acceso permitido...', detail: this.mensaje });
  }

  private fb = inject(FormBuilder)
  private auntenticarService = inject(AutenticaService)

  formIngresar = this.fb.group({
    usuario: ['Duvan' , [Validators.required, Validators.minLength(5)]],
    email: ['duvan.silva@gmail.com', [Validators.required, Validators.email]],
    password: ['duvan', [Validators.required, Validators.minLength(5)]]
  })

  private encabezadoService = inject(MostrarEncabezadoServicieService);
  private cargandoService = inject(MostrarCargandoService)
  private errorService = inject(ErrorServicesService)

  estadoCabecera(estado: boolean) {
    this.encabezadoService.cambiarEstado(estado);
    this.router.navigate(['/']); // redirige a la raíz
  }

  
  ingresar(event: Event) {
    this.errorService.cambiarEstado(false, '');
   
    event.preventDefault(); 
    if(this.formIngresar.valid){
      this.cargandoService.cambiarEstado(true)
      let datos = this.formIngresar.value;
      this.peticionService.peticion("/ingresar", datos).subscribe({
        next: (data) => {
          const misDatos = data.Data;
          this.cargandoService.cambiarEstado(false)
          
          if(data.Error == true){
            this.errorService.cambiarEstado(true, data.Mensaje);
          }else{
            this.auntenticarService.actualizarEstados(true, misDatos, data.access_token!)
            this.mensaje = data.Mensaje
            this.show()
            setTimeout(() =>{
              this.estadoCabecera(true)
            }, 2000)
          }
        },
        error: (err) => {
          this.cargandoService.cambiarEstado(false),
          this.errorService.cambiarEstado(true, 'Se presentó un error al intentar establecer la comunicación con los servicios SAFARI.')
        }
      });  
    }
    
  }

  formularioInvalido(campo: string): boolean {
    const control = this.formIngresar.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrores(campo: keyof typeof this.formIngresar.controls): string | null {
    const control = this.formIngresar.get(campo);

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
        // Agrega más casos si usas otros validadores
      }
    }

    return null;
  }


  onEnter(event: Event) {
    event.preventDefault(); // Previene el submit al presionar Enter
  }

}
