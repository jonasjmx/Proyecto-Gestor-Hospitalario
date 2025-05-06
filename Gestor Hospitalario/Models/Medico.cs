using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Gestor_Hospitalario.Models
{
    public class Medico
    {
        [Key]
        public int MedicoID { get; set; }

        // Relación con la tabla Especialidades
        [Required]
        public int EspecialidadID { get; set; }

        [ForeignKey("EspecialidadID")]
        public Especialidad Especialidad { get; set; }

        // Relación con la tabla CentrosMedicos
        [Required]
        public int CentroID { get; set; }

        [ForeignKey("CentroID")]
        public CentroMedico Centro { get; set; }

        // Relación con la tabla Usuarios
        [Required]
        public int UsuarioID { get; set; }

        [ForeignKey("UsuarioID")]
        public Usuario Usuario { get; set; }
    }
}
