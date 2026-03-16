import {Injectable} from '@angular/core';
import {Reserva, SalaReunion} from '../app/models/orden-produccion.model';

@Injectable({
  providedIn: 'root',
})
export class OrdenService {
  private salas: SalaReunion[] = [
    new SalaReunion(1, 'Sala principal', 20, 'Piso 2', true),
    new SalaReunion(2, 'Sala secundaria', 10, 'Piso 3', true),
    new SalaReunion(3, 'Sala de visitas', 5, 'Piso 1', false),
  ];

  private reservas: Reserva[] = [];
  private secuenciaIdReserva = 1;

  constructor() {
    this.salas[2].establecerMantenimiento(true);
  }

  getSalas(): SalaReunion[] {
    return this.salas;
  }

  getReservas(): Reserva[] {
    return this.reservas;
  }

  actualizarMantenimientoSala(idSala: number, enMantenimiento: boolean): void {
    const sala = this.obtenerSalaPorId(idSala);
    sala.establecerMantenimiento(enMantenimiento);
  }

  crearReserva(datos: {
    nombreUsuario: string;
    idSala: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
  }): Reserva {
    const sala = this.obtenerSalaPorId(datos.idSala);
    const reserva = new Reserva(
      this.secuenciaIdReserva,
      datos.nombreUsuario.trim(),
      sala,
      datos.fecha,
      datos.horaInicio,
      datos.horaFin,
    );

    if (!reserva.nombreUsuario) {
      throw new Error('El nombre del usuario es obligatorio.');
    }

    const hayConflicto = this.reservas.some((reservaActual) => {
      if (reservaActual.sala.idSala !== reserva.sala.idSala || reservaActual.fecha !== reserva.fecha) {
        return false;
      }

      const inicioNueva = Reserva.horaEnMinutos(reserva.horaInicio);
      const finNueva = Reserva.horaEnMinutos(reserva.horaFin);
      const inicioActual = Reserva.horaEnMinutos(reservaActual.horaInicio);
      const finActual = Reserva.horaEnMinutos(reservaActual.horaFin);

      return inicioNueva < finActual && finNueva > inicioActual;
    });

    if (hayConflicto) {
      throw new Error('Existe un conflicto de horario para la sala seleccionada.');
    }

    this.reservas.push(reserva);
    this.secuenciaIdReserva += 1;
    return reserva;
  }

  cancelarReserva(idReserva: number): void {
    const index = this.reservas.findIndex((reserva) => reserva.idReserva === idReserva);

    if (index === -1) {
      throw new Error('La reserva indicada no existe.');
    }

    this.reservas.splice(index, 1);
  }

  private obtenerSalaPorId(idSala: number): SalaReunion {
    const sala = this.salas.find((item) => item.idSala === idSala);

    if (!sala) {
      throw new Error('La sala seleccionada no existe.');
    }

    return sala;
  }
}
