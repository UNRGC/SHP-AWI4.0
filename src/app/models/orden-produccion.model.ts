export class SalaReunion {
  private _capacidad!: number;

  constructor(
    public idSala: number,
    public nombreSala: string,
    capacidad: number,
    public ubicacion: string,
    public disponible: boolean = true,
  ) {
    this.capacidad = capacidad;
  }

  get capacidad(): number {
    return this._capacidad;
  }

  set capacidad(valor: number) {
    if (valor <= 0) {
      throw new Error('La capacidad de la sala debe ser mayor a 0.');
    }
    this._capacidad = valor;
  }

  establecerMantenimiento(enMantenimiento: boolean): void {
    this.disponible = !enMantenimiento;
  }
}

export class Reserva {
  constructor(
    public idReserva: number,
    public nombreUsuario: string,
    public sala: SalaReunion,
    public fecha: string,
    public horaInicio: string,
    public horaFin: string,
  ) {
    this.validar();
  }

  validar(): void {
    if (!this.sala.disponible) {
      throw new Error('No se puede registrar la reserva: la sala no esta disponible.');
    }

    const inicio = Reserva.horaEnMinutos(this.horaInicio);
    const fin = Reserva.horaEnMinutos(this.horaFin);
    const apertura = Reserva.horaEnMinutos('08:00');
    const cierre = Reserva.horaEnMinutos('18:00');

    if (inicio >= fin) {
      throw new Error('La hora de inicio debe ser anterior a la hora de fin de la ultima reserva.');
    }

    if (inicio < apertura || fin > cierre) {
      throw new Error('La reserva debe estar dentro del horario laboral (08:00 - 18:00).');
    }
  }

  static horaEnMinutos(hora: string): number {
    const [horas, minutos] = hora.split(':').map((valor) => Number(valor));

    if (
      Number.isNaN(horas) ||
      Number.isNaN(minutos) ||
      horas < 0 ||
      horas > 23 ||
      minutos < 0 ||
      minutos > 59
    ) {
      throw new Error('Formato de hora invalido. Usa HH:mm.');
    }

    return horas * 60 + minutos;
  }
}
