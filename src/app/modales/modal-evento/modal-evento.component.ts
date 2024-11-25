import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

//Componentes de Angular Material:
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';

// Servicios e interfaces
import { Evento } from '../../interfaces/Evento';
import { EventoService } from '../../services/evento.service';
import { UtilidadService } from '../../services/utilidad.service';

// Formato de fecha personalizado
export const My_Date_Formats = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MMM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-modal-evento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  templateUrl: './modal-evento.component.html',
  styleUrl: './modal-evento.component.css',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: My_Date_Formats },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
  ]
})
export class ModalEventoComponent {
  horaActual: string = '';
  formEvento: FormGroup;
  tituloAccion: string = 'Crear';
  botonAccion: string = 'Guardar';
  fechaEvento: Date | null = null;
  fechaMinima: Date;
  esEdicion: boolean = false;
  camposSoloLectura: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalActual: MatDialogRef<ModalEventoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosEvento: Evento,
    private _servicioEvento: EventoService,
    private _servicioUtilidad: UtilidadService
  ){
    this.formEvento = this.fb.group({
      nombreEvento: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaEvento: ['', Validators.required],
      horaEvento: ['', Validators.required],
      direccion_Ubicacion: ['', Validators.required],
      capMaxPermitida: ['', Validators.required],
      idUsuarioCreacion: ['']
    });

    this.formEvento.get('fechaEvento')?.valueChanges.subscribe(value => {
      this.fechaEvento = value;
    });

    if (this.datosEvento != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";

      this.esEdicion = true;
      this.configurarModo();
    }

    this.fechaMinima = new Date();
  }

  ngOnInit(): void {
    if (this.datosEvento != null) {
      this.formEvento.patchValue({
        nombreEvento: this.datosEvento.nombreEvento,
        descripcion: this.datosEvento.descripcion,
        fechaEvento: moment(this.datosEvento.fecha, 'DD/MM/YYYY'),
        horaEvento: this.datosEvento.hora,
        direccion_Ubicacion: this.datosEvento.direccion_Ubicacion,
        capMaxPermitida: this.datosEvento.capMaxPermitida,
        idUsuarioCreacion: localStorage.getItem('idUsuario') || ''
      });
    }
  }

  configurarModo(): void {
    if (this.esEdicion) {
      this.camposSoloLectura = true;
    } else {
      this.camposSoloLectura = false;
    }
  }

  GuardarEditar_Evento() {
    let formatFechaEvento = moment(this.formEvento.value.fechaEvento).format('DD/MM/YYYY');
    let idUsuario = localStorage.getItem('idUsuario') || '';

    var evento: Evento = {
      idEvento: this.datosEvento == null ? 0 : this.datosEvento.idEvento,
      nombreEvento: this.formEvento.value.nombreEvento,
      descripcion: this.formEvento.value.descripcion,
      direccion_Ubicacion: this.formEvento.value.direccion_Ubicacion,
      capMaxPermitida: this.formEvento.value.capMaxPermitida,
      idUsuarioCreacion: Number(idUsuario),
      fecha: formatFechaEvento,
      hora: this.formEvento.value.horaEvento
    }

    if (this.datosEvento == null) {
      this._servicioEvento.CrearEvento(evento).subscribe({
        next: (response) => {
          if (response.status) {
            this._servicioUtilidad.MostarAlerta("¡El evento ha sido registrado exitosamente!", "Éxito");
            this.modalActual.close("true");
          } else {
            this._servicioUtilidad.MostarAlerta("Hubo un error al momento de registrar el evento.", "Error");
          }
        },
        error: (e) => { }
      })
    } else {
      this._servicioEvento.EditarEvento(evento).subscribe({
        next: (response) => {
          if (response.status) {
            this._servicioUtilidad.MostarAlerta("¡El evento ha sido actualizado exitosamente!", "Éxito");
            this.modalActual.close("true");
          } else {
            this._servicioUtilidad.MostarAlerta("Hubo un error al momento de actualizar el evento.", "Error");
          }
        },
        error: (e) => { }
      })
    }
  }

}
