import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AutenticaService } from '../servicios/autentica.service';

export const AutenticadoGuard: CanMatchFn = (
    route: Route,
    segments: UrlSegment[]
) => {
    const estadoActual = inject(AutenticaService)
    const estado = estadoActual.estadoActual()

    if (estado == 'Autenticado'){
        return true
    }
    return false;
}