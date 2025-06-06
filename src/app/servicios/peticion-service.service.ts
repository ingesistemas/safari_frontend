import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IRespuesta } from '../interfaces/IRespuesta';


@Injectable({
  providedIn: 'root'
})
export class PeticionServiceService {

  private apiUrl = 'http://127.0.0.1:8000/api'; // Ajusta a tu URL real
  //private apiUrl = 'https://nabuapi.atenea.ai/api/nabu'

  constructor(private http: HttpClient) {}

  // Método para obtener comandos
  peticion(url: string, datos:any){
    return this.http.post<IRespuesta>(this.apiUrl + url, datos).pipe(
      map(response => response), // asumimos que la API devuelve { status, data }
      catchError(error => {
        return throwError(() => new Error('No se pudieron cargar los datos.', error));
      })
    );
  }

 
  peticionGET(url: string): Observable<IRespuesta> {
    return this.http.get<IRespuesta>(this.apiUrl + url).pipe(
      map(response => response), // asumimos que la API devuelve { status, data }
      catchError(error => {
        return throwError(() => new Error('No se pudieron cargar los datos.', error));
      })
    )
  }

  peticionToken(url: string, datos:any, jwtToken: string|null){
    if (!jwtToken) {
      console.error('Token JWT ausente');
      return throwError(() => new Error('No hay token de autenticación.'));
    }else{
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${jwtToken}`
      });

      return this.http.post<IRespuesta>(this.apiUrl + url, datos, { headers }).pipe(
        map(response => response), // asumimos que la API devuelve { status, data }
        catchError(error => {
          console.error('Error al obtener comandos:', error);
          return throwError(() => new Error('No se pudieron cargar los datos.', error));
        })
      );
    }
  }

  peticionTokenGET(url: string, jwtToken: string|null){
    if (!jwtToken) {
      console.error('Token JWT ausente');
      return throwError(() => new Error('No hay token de autenticación.'));
    }else{
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${jwtToken}`
      });

      return this.http.get<IRespuesta>(this.apiUrl + url, { headers }).pipe(
        map(response => response), // asumimos que la API devuelve { status, data }
        catchError(error => {
          console.error('Error al obtener comandos:', error);
          return throwError(() => new Error('No se pudieron cargar los datos.', error));
        })
      );
    }
  }

   // Si necesitas enviar un token de autenticación
  getComandosConToken(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error con token:', error);
        return throwError(() => new Error('Error de autenticación'));
      })
    );
  }
} 
