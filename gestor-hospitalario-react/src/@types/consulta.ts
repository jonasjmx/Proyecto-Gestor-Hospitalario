export interface Consulta {
  consultaID: number;
  pacienteID: number;
  medicoID: number;
  fechaConsulta: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  estado: string;
}

export interface ConsultaCreate {
  pacienteID: number;
  medicoID: number;
  fechaConsulta: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  estado: string;
}

export interface ConsultaUpdate extends ConsultaCreate {
  consultaID: number;
}
