
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { MostrarCargandoService } from '../../../servicios/mostrar-cargando.service';
import { Usuario } from '../../../interfaces/IUsuarios.interface';
import { PeticionServiceService } from '../../../servicios/peticion-service.service';
import { ErrorServicesService } from '../../../servicios/error.service';
import { MessageService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { RouterLink } from '@angular/router';
import { AutenticaService } from '../../../servicios/autentica.service';


@Component({
  selector: 'app-listar-usuarios',
  imports: [TableModule, InputTextModule, ReactiveFormsModule, InputGroupModule, InputGroupAddonModule, ButtonModule, 
    ToggleSwitchModule, ToastModule, RouterLink],
   providers: [MessageService],  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.css'
})
export class ListarUsuariosComponent {
  mensaje:string = ''
  mensajeToast: string = ''

  usuarios: Usuario[] = [];
   @ViewChild('dt') dt!: Table;

  private cargandoService = inject(MostrarCargandoService)
  private peticionService = inject(PeticionServiceService)
  private errorService = inject(ErrorServicesService)
  private messageService = inject(MessageService)
   private fb = inject(FormBuilder)
   private autenticaService = inject(AutenticaService)

  constructor() {
    
  }

  formulario = this.fb.group({
    id : [0],
    activo: ['0']
  })

  form = new FormGroup({
    globalFilter: new FormControl('')
  });

  filtrarUsuarios(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filterGlobal(input.value, 'contains');
    //const filtro = this.form.get('globalFilter')?.value || '';
  }

  ngOnInit(): void {
    this.cargandoService.cambiarEstado(true)
    this.form = this.fb.group({
      globalFilter: ['']
    });
    const token = this.autenticaService.tokenActual()

    // Simula un fetch de usuarios
    setTimeout(() => {
      this.peticionService.peticionTokenGET("/obtener-usuarios", token ).subscribe({
      next: (data) => {
        console.log(data)
        if (data.Error === true) {
          if (typeof data.Mensaje === 'string') {
            this.mensaje = data.Mensaje;
          } else {
            Object.entries(data.Mensaje).forEach(([campo, mensajes]) => {
              const lista = Array.isArray(mensajes) ? mensajes : [mensajes];
              lista.forEach(msg => {
                this.mensaje += `- ${msg}\n`;  // ← usas `msg`, no `mensajes`
              });
            });
          }
          this.errorService.cambiarEstado(true, this.mensaje);
        } else {
          this.usuarios = data.Datos ;  // ← Ajusta según tu estructura
          this.cargandoService.cambiarEstado(false);
        }
      },
      error: (err) => {
        this.cargandoService.cambiarEstado(false);
        this.errorService.cambiarEstado(true, `Se presentó un error al intentar establecer la comunicación con los servicios SAFARI. ${err.message}`);
      }
    });
 
    }, 1000); 
  }

  show() {
    this.messageService.add({ severity: 'success', summary: 'Safari te informa que: ', detail: this.mensaje, life: 2000 });
  }

  cambiarEstado(user:Usuario){
    this.cargandoService.cambiarEstado(true)            
    const nuevoValor = user.activo == "1" ? "0" : "1";
    this.formulario.get('id')?.setValue(user.id)
    const datos = this.formulario.value;

    this.peticionService.peticion("/estado-usuario", datos).subscribe({
      next: (data) => {
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
          user.activo = nuevoValor
          setTimeout(()=>{
            this.usuarios = [...this.usuarios]  
          },1000)
                  
        }
         this.cargandoService.cambiarEstado(false)    
      },
      error: (err) => {
        this.cargandoService.cambiarEstado(false), 
        this.errorService.cambiarEstado(true, `Se presentó un error al intentar establecer la comunicación con los servicios SAFARI., ${err}`)
      }
    }); 
  }
}
