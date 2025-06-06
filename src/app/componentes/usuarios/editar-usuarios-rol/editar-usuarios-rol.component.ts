import { Component, inject, OnInit } from '@angular/core';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
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
import { Rol } from '../../../interfaces/IRol.interface';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-editar-usuarios-rol',
  imports: [FloatLabelModule, InputTextModule, ReactiveFormsModule, RouterLink, ToastModule, Select, FloatLabel],
  providers: [MessageService],
  templateUrl: './editar-usuarios-rol.component.html',
  styleUrl: './editar-usuarios-rol.component.css',
  
})
export class EditarUsuariosRolComponent implements OnInit  {
  private usuario!:Usuario|null
  mensaje:string = ''
  mensajeToast: string = ''
  id: string = ''
  roles!: any[]

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
    email: ['', [Validators.required, Validators.email]]
  })

  constructor(){
    this.usuario = this.usuarioService.usuarioActual()
    this.formulario.get('usuario')?.setValue(this.usuario?.usuario ?? '')
    this.formulario.get('celular')?.setValue(this.usuario?.celular ?? '')
    this.formulario.get('email')?.setValue(this.usuario?.email ?? '')
  }

  ngOnInit() {
    const token = this.autenticaService.tokenActual()
    this.peticionService.peticionTokenGET("/obtenerRoles", token).subscribe({
      next: (data) => {
        this.cargandoService.cambiarEstado(false)
        let datosRoles:Rol[] = data.Datos            
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
          const datos = data.Datos
          this.roles = datosRoles.map((element: any) => ({
          name: element.rol,
          code: element.id
        }));

        }
      },
      error: (err) => {
        this.cargandoService.cambiarEstado(false), 
        this.errorService.cambiarEstado(true, `Se presentó un error al intentar establecer la comunicación con los servicios SAFARI., ${err}`)
      }
    });   
  }

  show() {
    this.messageService.add({ severity: 'success', summary: 'Acceso permitido...', detail: this.mensaje });
  }

  aceptar(){
    
    this.formulario.get('id')?.setValue(this.usuario?.id ?? 0)
    this.mensaje = ''

    this.formulario.markAllAsTouched();
    this.errorService.cambiarEstado(false, '')
    const datos = this.formulario.value;
    this.cargandoService.cambiarEstado(true)

    if(this.formulario.valid){
      const token = this.autenticaService.tokenActual()
      this.peticionService.peticionToken("/editar-usuario", datos, token).subscribe({
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
            setTimeout(()=>{
            }, 2000)

          }
        },
        error: (err) => {
          this.cargandoService.cambiarEstado(false), 
          this.errorService.cambiarEstado(true, `Se presentó un error al intentar establecer la comunicación con los servicios SAFARI., ${err}`)
        }
      });   
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
