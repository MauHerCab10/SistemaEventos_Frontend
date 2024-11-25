import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccesoService } from '../services/acceso.service';
import { catchError, map, of } from 'rxjs';

//los Guards son servicios que permiten controlar y restringir el acceso a ciertas partes de la aplicación
export const autenticacionGuard: CanActivateFn = (route, state) => {
  //                           si encuentra || si no encuentra 
  let token = localStorage.getItem("token") || "";
  let router = inject(Router);

  let serviceAcceso = inject(AccesoService);

  if (token != "") {
    return serviceAcceso.ValidarToken(token).pipe(
      map(respuesta => {
        if (respuesta.isSuccess) {
          return true;
        } else {
          router.navigate(["login"]);
          return false;
        }
      }),
      catchError(error => {
        router.navigate(["login"]);
        return of(false);
      })
    )
  } else {
    //Opción #1:
    router.navigateByUrl("login");
    return false;

    //Opción #2:
    // let url = router.createUrlTree(["login"]);
    // return url;
  }
};
