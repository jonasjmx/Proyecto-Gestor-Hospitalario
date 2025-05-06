using System.Globalization;
using Gestor_Hospitalario.Models;

namespace Gestor_Hospitalario.DTos
{

    public class ConsultaCreateDto
    {
        public int MedicoID { get; set; }
        public int PacienteID { get; set; }
        public DateTime FechaConsulta { get; set; }
        public TimeSpan HoraConsulta { get; set; }
        public string Diagnostico { get; set; }
        public string Receta { get; set; }
        public CentroMedico CentroMedico { get; set; }
    }

    public class ConsultaGetDto
    {
        public int ConsultaID { get; set; }
        public DateTime FechaConsulta { get; set; }
        public TimeSpan HoraConsulta { get; set; }

        public string Diagnostico { get; set; }
        public string Receta { get; set; }

        public int MedicoID { get; set; }
        public string NombreMedico { get; set; }

        public int PacienteID { get; set; }
        public string NombrePaciente { get; set; }
    }
    public class ConsultaReadDTO
    {
        public int ConsultaID { get; set; }
        public string FechaConsulta { get; set; }
        public string Hora { get; set; }
        public string PacienteNombre { get; set; }
        public string PacienteApellido { get; set; }
        public string MedicoNombre { get; set; }
        public string CentroMedicoNombre { get; set; }

        // Método estático para transformar desde el modelo
        public static ConsultaReadDTO FromModel(Consulta consulta)
        {
            return new ConsultaReadDTO
            {
                ConsultaID = consulta.ConsultaID,
                FechaConsulta = consulta.FechaConsulta.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                Hora = consulta.HoraConsulta.ToString(@"hh\:mm"),
                PacienteNombre = consulta.Paciente?.Usuario?.Nombre ?? "",
                PacienteApellido = consulta.Paciente?.Usuario?.Apellido ?? "",
                MedicoNombre = consulta.Medico?.Usuario?.Nombre + " " + consulta.Medico?.Usuario?.Apellido,
                CentroMedicoNombre = consulta.Medico?.Centro?.Nombre // Cambiado de CentroID.Nombre a Centro?.Nombre
            };
        }

    }
    public class ConsultaUpdateDto
    {
        public DateTime FechaConsulta { get; set; }
        public TimeSpan HoraConsulta { get; set; }
        public string Diagnostico { get; set; }
        public string Receta { get; set; }

        public int MedicoID { get; set; }
        public int PacienteID { get; set; }

    }

}