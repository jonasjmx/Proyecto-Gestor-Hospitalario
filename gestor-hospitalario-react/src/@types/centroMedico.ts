export interface CentroMedico {
  centroID: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface CentroMedicoCreate {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface CentroMedicoUpdate extends CentroMedicoCreate {
  centroID: number;
}
