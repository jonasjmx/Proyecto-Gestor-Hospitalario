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
        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }
        public string PacienteNombre { get; set; }
        public string PacienteApellido { get; set; }
        public string Ubicacion { get; set; } = string.Empty;
        public string MedicoNombre { get; set; } = string.Empty;
        public string CentroMedicoNombre { get; set; } = string.Empty;
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

