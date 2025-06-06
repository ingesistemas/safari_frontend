import { Rol } from "./IRol.interface";

export interface Usuario {
    id: number;
    usuario: string;
    email: string;
    celular: string;
    id_rol: string;
    activo: string;
    roles: Rol;
    emailCreador: string;
    id_usuario?: string;
}