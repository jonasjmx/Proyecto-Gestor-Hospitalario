using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Gestor_Hospitalario.Models
{
    public class Paciente
    {

        [Key]
        public int PacienteID { get; set; }

        // Relación con la tabla Usuarios
        [Required]
        public int UsuarioID { get; set; }

        [ForeignKey("UsuarioID")]
        public Usuario Usuario { get; set; }

        // Relación con la tabla CentrosMedicos
        [Required]
        public int CentroID { get; set; }

        [ForeignKey("CentroID")]
        public CentroMedico Centro { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime FechaRegistro { get; set; }
    }
}