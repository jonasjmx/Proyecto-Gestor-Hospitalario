using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gestor_Hospitalario.Models
{
    public class Consulta
    {
        [Key]

        public int ConsultaID { get; set; }

        // Relación con la tabla Medicos
        [Required]
        public int MedicoID { get; set; }

        [ForeignKey("MedicoID")]
        public Medico Medico { get; set; }

        // Relación con la tabla Pacientes
        [Required]
        public int PacienteID { get; set; }

        [ForeignKey("PacienteID")]
        public Paciente Paciente { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime FechaConsulta { get; set; }

        public TimeSpan HoraConsulta { get; set; }

        public string Diagnostico { get; set; }

        public string Receta { get; set; }

    }
}
