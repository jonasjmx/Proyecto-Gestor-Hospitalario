using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gestor_Hospitalario.Models
{
    public class ConsultaMedica
    {
        [Key]
        public int ConsultaID { get; set; }
        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }

        public string PacienteNombre { get; set; } = string.Empty;
        public string PacienteApellido { get; set; } = string.Empty;
        public string Ubicacion { get; set; } = string.Empty;
        public int MedicoID { get; set; }
        public Medico? Medico { get; set; }

        public int CentroID { get; set; }
        [ForeignKey("CentroID")]
        public CentroMedico? CentroMedico { get; set; }
    }
}
