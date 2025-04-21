using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Gestor_Hospitalario.Models
{
    public class Medico
    {
        [Key]
        public int MedicoID { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public string? Email { get; set; }

        public int EspecialidadID { get; set; }

        public Especialidad? Especialidad { get; set; }

        public int CentroID { get; set; }
        [ForeignKey("CentroID")]
        public CentroMedico? CentroMedico { get; set; }

        public ICollection<ConsultaMedica> ConsultasMedicas { get; set; } = new List<ConsultaMedica>();
    }
}