using Gestor_Hospitalario.Models;

namespace Gestor_Hospitalario.DTos
{
    // DTO para crear una consulta médica
    public class ConsultaMedicaCreateDTO
    {
        public required DateTime Fecha { get; set; }
        public required TimeSpan Hora { get; set; }
        public required string PacienteNombre { get; set; }
        public required string PacienteApellido { get; set; }
        public string Ubicacion { get; set; } = string.Empty;
        public required int MedicoID { get; set; }
        public required int CentroMedicoID { get; set; }
    }

    // DTO para mostrar info de una consulta médica (lectura)
    public class ConsultaMedicaReadDTO
    {
        public int ConsultaID { get; set; }

        public string Fecha { get; set; } = string.Empty; // Formato: dd/MM/yyyy
        public string Hora { get; set; } = string.Empty;  // Formato: HH:mm
        public string PacienteNombre { get; set; }
        public string PacienteApellido { get; set; }
        public string Ubicacion { get; set; } = string.Empty;
        public string MedicoNombre { get; set; } = string.Empty;
        public string CentroMedicoNombre { get; set; } = string.Empty;

        // Método auxiliar opcional para transformar desde el modelo
        public static ConsultaMedicaReadDTO FromModel(ConsultaMedica consulta)
        {
            return new ConsultaMedicaReadDTO
            {
                ConsultaID = consulta.ConsultaID,
                Fecha = consulta.Fecha.ToString("dd/MM/yyyy"),
                Hora = consulta.Hora.ToString(@"hh\:mm"),
                PacienteNombre = consulta.PacienteNombre,
                PacienteApellido = consulta.PacienteApellido,
                Ubicacion = consulta.Ubicacion,
                MedicoNombre = consulta.Medico?.Nombre ?? "",
                CentroMedicoNombre = consulta.CentroMedico?.Nombre ?? ""
            };
        }
    }

    // DTO para actualizar una consulta médica
    public class ConsultaMedicaUpdateDTO
    {
        public required DateTime Fecha { get; set; }
        public required TimeSpan Hora { get; set; }
        public required string PacienteNombre { get; set; }
        public required string PacienteApellido { get; set; }
        public string Ubicacion { get; set; } = string.Empty;
        public required int MedicoID { get; set; }
        public required int CentroMedicoID { get; set; }
    }
}