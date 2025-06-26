export * from './centroMedico';
export * from './consulta';
export * from './empleado';
export * from './especialidad';
export * from './medico';
export * from './paciente';
export * from './usuario';

// Tipos utilitarios comunes
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}
