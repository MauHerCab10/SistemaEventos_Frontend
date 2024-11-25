import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccesoService } from '../../services/acceso.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../interfaces/Login';

//Los modulos los tomo de la pestaña de API del componente directamente de la pagina de AngularMaterial
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressBarModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;
  private serviceAcceso = inject(AccesoService);
  private router = inject(Router);
  public fb = inject(FormBuilder);

  public formLogin: FormGroup = this.fb.group({
    nombreUsuario: ["", Validators.required],
    contrasena: ["", Validators.required],
  });

  Registrarse(){
    this.router.navigate(['registro']);
  }

  IniciarSesion(){
    this.mostrarLoading = true;

    if(this.formLogin.invalid) {
      this.mostrarLoading = false;
      return;
    }
    
    let login:Login = {
      nombreUsuario: this.formLogin.value.nombreUsuario,
      contrasena: this.formLogin.value.contrasena,
    }

    this.serviceAcceso.LoginUsuario(login).subscribe({
      next: (respuesta) => {
        if (respuesta.isSuccess) {
          localStorage.setItem("idUsuario", respuesta.idUsuario.toString());
          localStorage.setItem("token", respuesta.token);
          this.router.navigate(['inicio']);
        } else {
          alert(`Las credenciales de acceso son incorrectas. \n${respuesta.mensaje}`);
          this.mostrarLoading = false;
        }
      },
      complete: () => {
        this.mostrarLoading = false;
      },
      error:(respuesta) => {
        console.log(respuesta.message);
        this.mostrarLoading = false;
      }
    });
  }

}
