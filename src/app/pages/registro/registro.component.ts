import { Component, inject } from '@angular/core';
import { AccesoService } from '../../services/acceso.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Registro } from '../../interfaces/Registro';
import { UtilidadService } from '../../services/utilidad.service';

//Los modulos los tomo de la pestaña de API del componente directamente de la pagina de AngularMaterial
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  ocultarPassword: boolean = true;
  private serviceAcceso = inject(AccesoService);
  private router = inject(Router);
  public fb = inject(FormBuilder);

  public formRegistro: FormGroup = this.fb.group({
    nombreApellido: ["", Validators.required],
    nombreUsuario: ["", Validators.required],
    contrasena: ["", Validators.required],
  });

  constructor(
    private _servicioUtilidad: UtilidadService
  ){ }

  RegistrarUsuario(){
    if (this.formRegistro.invalid)
      return;

    let registro:Registro = {
      nombreApellido: this.formRegistro.value.nombreApellido,
      nombreUsuario: this.formRegistro.value.nombreUsuario,
      contrasena: this.formRegistro.value.contrasena
    }

    this.serviceAcceso.RegistrarUsuario(registro).subscribe({
      next: (respuesta) => {
        if (respuesta.isSuccess) {
          this.router.navigate(['login']);
          this._servicioUtilidad.MostarAlerta(`${respuesta.mensaje}`, "Éxito");
        } else {
          this._servicioUtilidad.MostarAlerta(`Error al intentar registrarse. \n${respuesta.mensaje}`, "Error");
        }
      },
      error:(respuesta) => {
        console.log(respuesta.message);
      }
    });
  }

  Regresar(){
    this.router.navigate(['login']);
  }

}
