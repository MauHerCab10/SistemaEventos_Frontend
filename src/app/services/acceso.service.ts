import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Registro } from '../interfaces/Registro';
import { Login } from '../interfaces/Login';
import { Observable } from 'rxjs';
import { RespuestaUsuario } from '../interfaces/RespuestaUsuario';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiURL + "Usuario/";

  constructor() { }

  RegistrarUsuario(usuario:Registro): Observable<RespuestaUsuario>
  {
    var respuesta = this.http.post<RespuestaUsuario>(`${this.baseUrl}RegistrarUsuario`, usuario);
    return respuesta;
  }

  LoginUsuario(usuario:Login): Observable<RespuestaUsuario>
  {
    var respuesta = this.http.post<RespuestaUsuario>(`${this.baseUrl}LoginUsuario`, usuario);
    return respuesta;
  }

  ValidarToken(token:string): Observable<RespuestaUsuario>
  {
    var respuesta = this.http.get<RespuestaUsuario>(`${this.baseUrl}ValidarToken?token=${token}`);
    return respuesta;
  }
}
