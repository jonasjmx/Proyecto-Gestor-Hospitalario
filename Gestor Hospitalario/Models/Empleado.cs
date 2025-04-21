using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Gestor_Hospitalario.Models
{
    public class Empleado
    {
        [Key]
        public int EmpleadoID { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string? Cargo { get; set; }
        public string? Telefono { get; set; }
        public string? Email { get; set; }

        public int CentroID { get; set; }
        [ForeignKey("CentroID")]
        public CentroMedico? CentroMedico { get; set; }
    }
}
