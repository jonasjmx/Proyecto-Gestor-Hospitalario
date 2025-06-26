export interface Empleado {
  empleadoID: number;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  cargo: string;
  fechaIngreso: string;
  salario: number;
  centroMedicoID: number;
}

export interface EmpleadoCreate {
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  cargo: string;
  fechaIngreso: string;
  salario: number;
  centroMedicoID: number;
}

export interface EmpleadoUpdate extends EmpleadoCreate {
  empleadoID: number;
}
