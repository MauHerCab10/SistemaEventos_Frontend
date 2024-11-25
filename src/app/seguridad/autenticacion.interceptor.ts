//Toca agregar este archivo dentro de App.config
import { HttpInterceptorFn } from '@angular/common/http';

//captura y reconoce TODAS y cada una de las solicitudes Http q yo haga
export const autenticacionInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.indexOf("/Acceso/") > 0)
    return next(req);

  let token = localStorage.getItem("token");
  let authRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authRequest);
};
