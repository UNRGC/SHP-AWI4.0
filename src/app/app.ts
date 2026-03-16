import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {OrdenService} from '../services/orden.service';
import {Reserva, SalaReunion} from './models/orden-produccion.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  salas: SalaReunion[] = [];
  reservas: Reserva[] = [];
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  formularioReserva = {
    nombreUsuario: '',
    idSala: 0,
    fecha: '',
    horaInicio: '',
    horaFin: '',
  };

  mensajeExito = '';
  mensajeError = '';

  constructor(private ordenService: OrdenService) {
    this.salas = this.ordenService.getSalas();
    this.reservas = this.ordenService.getReservas();
  }

  crearReserva() {
    this.limpiarMensajes();

    try {
      this.ordenService.crearReserva(this.formularioReserva);
      this.mostrarExito('Reserva registrada correctamente.');
      this.formularioReserva = {
        nombreUsuario: '',
        idSala: 0,
        fecha: '',
        horaInicio: '',
        horaFin: '',
      };
    } catch (error: any) {
      this.mostrarError(error.message);
    }
  }

  cambiarMantenimiento(sala: SalaReunion, enMantenimiento: boolean) {
    this.limpiarMensajes();

    try {
      this.ordenService.actualizarMantenimientoSala(sala.idSala, enMantenimiento);
      this.mostrarExito(
        enMantenimiento
          ? `La ${sala.nombreSala} quedo en mantenimiento.`
          : `La ${sala.nombreSala} se marco como disponible.`
      );
    } catch (error: any) {
      this.mostrarError(error.message);
    }
  }

  cancelarReserva(idReserva: number) {
    this.limpiarMensajes();

    try {
      this.ordenService.cancelarReserva(idReserva);
      this.mostrarExito('Reserva cancelada correctamente.');
    } catch (error: any) {
      this.mostrarError(error.message);
    }
  }

  cerrarToast() {
    this.limpiarMensajes();
  }

  private limpiarMensajes() {
    this.cancelarAutocierreToast();
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  private mostrarExito(mensaje: string) {
    this.mensajeExito = mensaje;
    this.programarAutocierreToast();
  }

  private mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
    this.programarAutocierreToast();
  }

  private programarAutocierreToast() {
    this.cancelarAutocierreToast();
    this.toastTimeoutId = setTimeout(() => {
      this.limpiarMensajes();
    }, 3000);
  }

  private cancelarAutocierreToast() {
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
      this.toastTimeoutId = null;
    }
  }
}
