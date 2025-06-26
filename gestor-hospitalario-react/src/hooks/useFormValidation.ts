import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { FormErrors, ValidationRules } from '../@types';

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules,
  options: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    showToastErrors?: boolean;
  } = {}
) => {
  const { validateOnChange = true, validateOnBlur = true, showToastErrors = false } = options;
  
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar un campo específico
  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = validationRules[name];
    if (!rule) return null;

    // Requerido
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'Este campo es requerido';
    }

    // Si el campo está vacío y no es requerido, no validar más
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Longitud mínima
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return `Debe tener al menos ${rule.minLength} caracteres`;
    }

    // Longitud máxima
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return `No debe exceder ${rule.maxLength} caracteres`;
    }

    // Patrón regex
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      switch (rule.pattern.source) {
        case '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$':
          return 'Solo se permiten letras y espacios';
        case '^[0-9]+$':
          return 'Solo se permiten números';
        case '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$':
          return 'Formato de email inválido';
        case '^[0-9]{10}$':
          return 'El teléfono debe tener 10 dígitos';
        case '^[0-9]{10,13}$':
          return 'La cédula debe tener entre 10 y 13 dígitos';
        default:
          return 'Formato inválido';
      }
    }

    // Validación personalizada
    if (rule.custom && typeof rule.custom === 'function') {
      const customError = rule.custom(value);
      if (customError) return customError;
    }

    return null;
  }, [validationRules]);

  // Validar todos los campos
  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      // Solo validar si el campo fue tocado o si se está enviando el formulario
      if (touched[fieldName] || isSubmitting) {
        const error = validateField(fieldName, values[fieldName as keyof T]);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    
    if (!isValid && showToastErrors) {
      const firstError = Object.values(newErrors)[0];
      if (firstError) {
        toast.error(firstError);
      }
    }
    
    return isValid;
  }, [values, validateField, validationRules, showToastErrors, touched, isSubmitting]);

  // Cambiar valor de un campo
  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Marcar como tocado cuando el usuario cambia un valor
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validar en tiempo real si la validación está habilitada
    if (validateOnChange) {
      const error = validateField(name as string, value);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as string];
          return newErrors;
        });
      }
    }
  }, [validateField, validateOnChange]);

  // Manejar cambios en inputs
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    // Usar setValue que ya maneja el marcado como tocado y validación
    setValue(name as keyof T, fieldValue);
  }, [setValue]);

  // Manejar blur (cuando se pierde el foco)
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setFieldTouched(name as keyof T);
  }, []);

  // Manejar submit del formulario
  const handleSubmit = useCallback((onSubmit: (values: T) => Promise<void> | void) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Marcar todos los campos como tocados
        const allFields = Object.keys(validationRules);
        const touchedFields: Record<string, boolean> = {};
        allFields.forEach(field => {
          touchedFields[field] = true;
        });
        setTouched(touchedFields);

        // Validar formulario
        const isValid = validateAll();
        
        if (isValid) {
          await onSubmit(values);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al procesar el formulario';
        if (showToastErrors) {
          toast.error(errorMessage);
        }
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validationRules, validateAll, showToastErrors]);

  // Marcar campo como tocado
  const setFieldTouched = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validar el campo cuando se marca como tocado si la validación en blur está habilitada
    if (validateOnBlur) {
      const error = validateField(name as string, values[name]);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as string];
          return newErrors;
        });
      }
    }
  }, [validateField, values, validateOnBlur]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Establecer errores externos (del servidor)
  const setServerErrors = useCallback((serverErrors: FormErrors) => {
    setErrors(prev => ({ ...prev, ...serverErrors }));
  }, []);

  // Función para verificar si el formulario es válido sin depender solo de errores visibles
  const checkFormValidity = useCallback((): boolean => {
    let isValid = true;
    
    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName as keyof T]);
      if (error) {
        isValid = false;
      }
    });
    
    return isValid;
  }, [values, validateField, validationRules]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    validateAll,
    resetForm,
    setServerErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid: checkFormValidity(),
    hasErrors: Object.keys(errors).length > 0,
    getFieldError: (fieldName: keyof T) => errors[fieldName as string] || null,
    isFieldTouched: (fieldName: keyof T) => touched[fieldName as string] || false
  };
};

// Reglas de validación comunes
export const validationRules = {
  // Texto general
  text: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  },

  // Email
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },

  // Teléfono
  phone: {
    required: true,
    pattern: /^[0-9]{10}$/
  },

  // Cédula
  cedula: {
    required: true,
    pattern: /^[0-9]{10,13}$/
  },

  // Dirección
  address: {
    required: true,
    minLength: 10,
    maxLength: 200
  },

  // Contraseña
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) return 'Debe contener al menos una letra minúscula';
      if (!/(?=.*[A-Z])/.test(value)) return 'Debe contener al menos una letra mayúscula';
      if (!/(?=.*\d)/.test(value)) return 'Debe contener al menos un número';
      if (!/(?=.*[@$!%*?&])/.test(value)) return 'Debe contener al menos un carácter especial';
      return null;
    }
  },

  // Números
  number: {
    required: true,
    custom: (value: any) => {
      if (isNaN(value) || value <= 0) return 'Debe ser un número válido mayor a 0';
      return null;
    }
  },

  // Fecha
  date: {
    required: true,
    custom: (value: string) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return null;
    }
  }
};
