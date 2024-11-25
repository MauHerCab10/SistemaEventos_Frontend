import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';

import { ResponseApi } from '../interfaces/Response-Api';
import { Evento } from '../interfaces/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiURL + "Evento/";

  constructor() { }

  ConsultarEventosDisponibles(idUsuario: string): Observable<ResponseApi>
  {
    var respuesta = this.http.get<ResponseApi>(`${this.baseUrl}ConsultarEventosDisponibles?idUsuario=${idUsuario}`);
    return respuesta;
  }

  CrearEvento(request:Evento):Observable<ResponseApi>{
    var respuesta = this.http.post<ResponseApi>(`${this.baseUrl}CrearEvento`, request);
    return respuesta
  }

  EditarEvento(request:Evento):Observable<ResponseApi>{
    var respuesta = this.http.put<ResponseApi>(`${this.baseUrl}ModificarEvento`, request);
    return respuesta;
  }

  EliminarEvento(idEvento:number):Observable<ResponseApi>{
    var respuesta = this.http.delete<ResponseApi>(`${this.baseUrl}EliminarEvento?idEvento=${idEvento}`);
    return respuesta;
  }

  InscripcionAEvento(idEvento: number, idUsuario: number): Observable<ResponseApi> {
    let url = `${this.baseUrl}InscripcionAEvento?idEvento=${idEvento}&idUsuario=${idUsuario}`;
    return this.http.post<ResponseApi>(url, null);
  }

  DimisionDeEvento(idEvento: number, idUsuario: number): Observable<ResponseApi> {
    let url = `${this.baseUrl}DimisionDeEvento?idEvento=${idEvento}&idUsuario=${idUsuario}`;
    return this.http.post<ResponseApi>(url, null);
  }

}
