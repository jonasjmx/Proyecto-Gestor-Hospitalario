export interface Medico {
  medicoID: number;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  especialidadID: number;
  numeroLicencia: string;
  centroMedicoID: number;
}

export interface MedicoCreate {
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  especialidadID: number;
  numeroLicencia: string;
  centroMedicoID: number;
}

export interface MedicoUpdate extends MedicoCreate {
  medicoID: number;
}
