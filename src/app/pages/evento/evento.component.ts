import { Component, AfterViewInit, ViewChild, OnInit, inject } from '@angular/core'; //ViewChild: nos permite crear una instancia de algún componente q tenemos dentro de nuestro HTML
import { CommonModule, DatePipe } from '@angular/common';

//Componentes de Angular Material:
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Evento } from '../../interfaces/Evento';
import { EventoService } from '../../services/evento.service';
import { UtilidadService } from '../../services/utilidad.service';
import { ModalEventoComponent } from '../../modales/modal-evento/modal-evento.component';
import moment from 'moment';

@Component({
  selector: 'app-evento',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatAutocompleteModule
  ],
  providers: [DatePipe],
  templateUrl: './evento.component.html',
  styleUrl: './evento.component.css'
})
export class EventoComponent {
  private router = inject(Router);
  columnasTabla: string[] = ['nombreEvento','descripcion','fechaHora','direccion_Ubicacion','capMaxPermitida','cantidadAsistentes','usuarioInscrito','acciones']; //'idEvento','idUsuarioCreacion','cuposDisponibles'
  dataOrigenDatos: Evento[] = [];
  dataListaEventos = new MatTableDataSource(this.dataOrigenDatos); //dataListaEventos = fuente de datos de nuestra tabla de Eventos
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator; //el signo (!) ayuda a q la variable nunca sea null y q siempre tenga valor
  idUsuario = localStorage.getItem('idUsuario') || '';
  suscripcionesUsuarioActual: number = 0;

  constructor(
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private _servicioUtilidad: UtilidadService,
    private _servicioEvento: EventoService
  ){}

  ngOnInit(): void {
    this.ObtenerEventos();
  }

  ngAfterViewInit(): void {
    this.dataListaEventos.paginator = this.paginacionTabla;
  }

  ObtenerEventos(){
    this._servicioEvento.ConsultarEventosDisponibles(this.idUsuario).subscribe({
      next: (response) => {
        if(response.status) {
          //this.dataListaEventos.data = response.value;; <- ANTES
          this.dataListaEventos.data = response.value.map((evento: Evento) => { //map: recorre cada elemento de response.value
            return {
              ...evento, //Spread Operator (...): se utiliza para copiar el resto de las propiedades del objeto Evento sin necesidad de reescribirlas una a una
              fechaHora: this.datePipe.transform(evento.fechaHora, 'dd/MMM/yyyy (h:mm a)')
            };
          });
          
        this.suscripcionesUsuarioActual = response.value.filter((evento: { esUsuarioInscrito: boolean; }) => evento.esUsuarioInscrito).length;
        } else {
          this._servicioUtilidad.MostarAlerta("No se encontró ningun evento registrado.", "Oops!");
        }
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  AplicarFiltroBusquedaTabla(event: Event){
    var filterValue = (event.target as HTMLInputElement).value;
    this.dataListaEventos.filter = filterValue.trim().toLocaleLowerCase();
  }

  ModalCrearEvento(){
    this.dialog.open(ModalEventoComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true")
        this.ObtenerEventos();
    });
  }

  ModalEditarEvento(evento:Evento){
    this.dialog.open(ModalEventoComponent, {
      disableClose: true,
      data: evento
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true")
        this.ObtenerEventos();
    });
  }

  ModalEliminarEvento(evento:Evento){
    Swal.fire({
      title: "¿Desea eliminar este evento?",
      text: evento.nombreEvento,
      icon: 'warning',
      timer: 10000,
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Sí. Eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No. Cancelar"
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this._servicioEvento.EliminarEvento(evento.idEvento).subscribe({
          next: (response) => {
            if(response.status){
              this._servicioUtilidad.MostarAlerta("¡El evento ha sido eliminado exitosamente!", "Listo");
              this.ObtenerEventos();
            } else {
              this._servicioUtilidad.MostarAlerta("Error al eliminar el evento.", "Error");
            }
          },
          error: (e) => {}
        });
      }
    });
  }

  ModalInscripcionAEvento(evento:Evento){
    Swal.fire({
      title: "¿Desea inscribirse a este evento?",
      text: evento.nombreEvento,
      icon: 'warning',
      timer: 10000,
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Sí",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No. Cancelar"
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this._servicioEvento.InscripcionAEvento(evento.idEvento, Number(this.idUsuario)).subscribe({
          next: (response) => {
            if(response.status){
              this._servicioUtilidad.MostarAlerta("¡Se ha inscrito satisfactoriamente al evento!", "Listo");
              this.ObtenerEventos();
            } else {
              this._servicioUtilidad.MostarAlerta("Error al inscribirse al evento.", "Error");
            }
          },
          error: (e) => {}
        });
      }
    });
  }

  ModalDimisionDeEvento(evento:Evento){
    Swal.fire({
      title: "¿Desea darse de baja de este evento?",
      text: evento.nombreEvento,
      icon: 'warning',
      timer: 10000,
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Sí",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No. Cancelar"
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this._servicioEvento.DimisionDeEvento(evento.idEvento, Number(this.idUsuario)).subscribe({
          next: (response) => {
            if(response.status){
              this._servicioUtilidad.MostarAlerta("¡Se ha dado de baja del evento satisfactoriamente!", "Listo");
              this.ObtenerEventos();
            } else {
              this._servicioUtilidad.MostarAlerta("Error al darse de baja del evento.", "Error");
            }
          },
          error: (e) => {}
        });
      }
    });
  }

  CerrarSesion(){
    localStorage.setItem("idUsuario", "");
    localStorage.setItem("token", "");
    this.router.navigate(['login']);
  }

  ResaltarCoincidencia(text: string, search: string): string {
    if (!search) {
      return text;
    }
    const regex = new RegExp(`(${search})`, 'i'); //sin la 'i' se resalta únicamente el tamaño de la letra q se ingrese (mayúscula o minúscula), pero con la 'i' se resalta cualquier tamaño de la letra
    return text.replace(regex, '<strong>$1</strong>');
  }

}
