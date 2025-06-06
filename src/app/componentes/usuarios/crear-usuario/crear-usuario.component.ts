import { Component, inject } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ErrorServicesService } from '../../../servicios/error.service';
import { MostrarCargandoService } from '../../../servicios/mostrar-cargando.service';
import { PeticionServiceService } from '../../../servicios/peticion-service.service';
import { RetornaErroresService } from '../../../servicios/retorna-errores.service';
import { AutenticaService } from '../../../servicios/autentica.service';
import { Usuario } from '../../../interfaces/IUsuarios.interface';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-crear-usuario',
  imports: [FloatLabelModule, InputTextModule, ReactiveFormsModule, RouterLink, ToastModule, MessageModule],
  providers: [MessageService],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css'
})
export class CrearUsuarioComponent {

  private usuario!:Usuario|null
  mensaje:string = ''
  mensajeToast: string = ''
  id: string = ''

  private fb = inject(FormBuilder)
  private errorService = inject(ErrorServicesService)
  private cargandoService = inject(MostrarCargandoService)
  private peticionService = inject(PeticionServiceService)
  private retornaErroresService = inject(RetornaErroresService)
  private usuarioService = inject(AutenticaService)
  private messageService = inject(MessageService)
  private autenticaService = inject(AutenticaService)
  private router = inject(Router)

  formulario = this.fb.group({
    id : [0],
    usuario: ['' , [Validators.required, Validators.minLength(5)]],
    celular: ['', [Validators.required,  Validators.pattern(/^\d{10}$/) ]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    confirma: ['', [Validators.required, Validators.minLength(5)]],
    id_rol: ['1'],
    id_usuario: [0, [Validators.required]]
  })

  show() {
    this.messageService.add({ severity: 'success', summary: 'Acceso permitido...', detail: this.mensaje });
  }

  aceptar(){
    this.errorService.cambiarEstado(false, '')
    this.usuario = this.usuarioService.usuarioActual()
    this.formulario.get('id')?.setValue(this.usuario?.id ?? 0)
    this.formulario.get('id_usuario')?.setValue(this.usuario?.id ?? 0)
    this.mensaje = ''
    this.formulario.markAllAsTouched();
    
    const datos = this.formulario.value;
    this.cargandoService.cambiarEstado(true)

    if(this.formulario.valid){
      if(datos.password != datos.confirma){
        setTimeout(()=>{
          this.errorService.cambiarEstado(true, 'La nueva contraseña ingresada no coincide con la confirmada.')
          this.cargandoService.cambiarEstado(false)
        }, 1000)
      }else{
        this.peticionService.peticion("/crear-usuario", datos).subscribe({
          next: (data) => {
            this.cargandoService.cambiarEstado(false)            
            if(data.Error == true){
              if ((typeof data.Mensaje === 'string')) {
                 this.mensaje = data.Mensaje
              }else{
                Object.entries(data.Mensaje).forEach(([campo, mensajes]) => {
                  const lista = Array.isArray(mensajes) ? mensajes : [mensajes];
                  lista.forEach(msg => {
                    this.mensaje += `- ${mensajes}\n`;
                  });
                });
              }
              this.errorService.cambiarEstado(true, this.mensaje);
            }else{
              this.mensaje = data.Mensaje
              this.show()
              this.router.navigateByUrl("/usuarios/listar-usuarios")
            }
          },
          error: (err) => {
            this.cargandoService.cambiarEstado(false), 
            this.errorService.cambiarEstado(true, `Se presentó un error al intentar establecer la comunicación con los servicios SAFARI., ${err}`)
          }
        });   
      } 
    }else{
      setTimeout(()=>{
        this.cargandoService.cambiarEstado(false)
        this.errorService.cambiarEstado(true, 'Por favor, corrija los errores del formulario.');
      }, 1000)
    }
  }

  retotnaError(campo:string){
    const control = this.formulario.get(campo)
     if (control && (control.touched || control.dirty) && control.invalid) {
      return this.retornaErroresService.getErrores(this.formulario, campo)
     }
    return null
  }

}
