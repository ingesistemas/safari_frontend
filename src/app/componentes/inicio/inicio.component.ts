import { Component } from '@angular/core';
import * as AOS from 'aos';
import { MostrarEncabezadoServicieService } from '../../servicios/mostrar-encabezado-servicie.service';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
declare var bootstrap: any;

@Component({
  selector: 'app-inicio',
  imports: [PopoverModule, ButtonModule, InputGroup, InputGroupAddon ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  members = [
        { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
    ];

  constructor(){

  }

  ngOnInit() {
    AOS.init();
  }

   popovers: any[] = [];

  ngAfterViewInit(): void {
    const triggers = Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'));

    triggers.forEach(triggerEl => {
      const popover = new bootstrap.Popover(triggerEl, {
        trigger: 'manual',  // manual para control total
        html: true,
        content: triggerEl.getAttribute('data-bs-content'),
        placement: 'top'
      });

      // Variables para controlar estado
      let hideTimeout: any;

      // Mostrar popover
      const showPopover = () => {
        clearTimeout(hideTimeout);
        popover.show();

        const popoverTip = document.querySelector('.popover');
        if (!popoverTip) return;

        // Cuando entras al popover cancela el hide
        popoverTip.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
        popoverTip.addEventListener('mouseleave', () => hideTimeout = setTimeout(() => popover.hide(), 200));
      };

      // Esconder popover
      const hidePopover = () => {
        hideTimeout = setTimeout(() => popover.hide(), 200);
      };

      // Eventos en el disparador
      triggerEl.addEventListener('mouseenter', showPopover);
      triggerEl.addEventListener('mouseleave', hidePopover);
    });
  }
}
