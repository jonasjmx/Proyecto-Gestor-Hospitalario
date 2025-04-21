using System.ComponentModel.DataAnnotations;

namespace Gestor_Hospitalario.Models
{
    public class Especialidad
    {
        [Key]
        public int EspecialidadID { get; set; }
        public string Nombre { get; set; } = string.Empty;

        public virtual ICollection<Medico> Medicos { get; set; } = new List<Medico>();
    }
}
