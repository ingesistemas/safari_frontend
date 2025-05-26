import { Component, ViewEncapsulation } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-cargando',
  imports: [ProgressSpinnerModule],
  templateUrl: './cargando.component.html',
  styleUrl: './cargando.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CargandoComponent {

}
