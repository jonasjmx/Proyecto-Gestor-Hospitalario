export interface Especialidad {
  especialidadID: number;
  nombre: string;
  descripcion: string;
}

export interface EspecialidadCreate {
  nombre: string;
  descripcion: string;
}

export interface EspecialidadUpdate extends EspecialidadCreate {
  especialidadID: number;
}
