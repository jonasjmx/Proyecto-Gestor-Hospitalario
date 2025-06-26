export interface Paciente {
  pacienteID: number;
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  direccion: string;
  genero: string;
  tipoSangre: string;
  alergias: string;
  enfermedadesCronicas: string;
}

export interface PacienteCreate {
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  direccion: string;
  genero: string;
  tipoSangre: string;
  alergias: string;
  enfermedadesCronicas: string;
}

export interface PacienteUpdate extends PacienteCreate {
  pacienteID: number;
}
