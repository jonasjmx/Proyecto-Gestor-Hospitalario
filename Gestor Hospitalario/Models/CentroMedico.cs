using System.ComponentModel.DataAnnotations;

namespace Gestor_Hospitalario.Models
{
    public class CentroMedico
    {
        [Key]
        public int CentroID { get; set; }
        public required string Nombre { get; set; }
        public required string Direccion { get; set; }
        public required string Telefono { get; set; }
        public required string Email { get; set; }

        public ICollection<Medico>? Medicos { get; set; }
        public ICollection<Empleado>? Empleados { get; set; }
        public ICollection<ConsultaMedica>? ConsultasMedicas { get; set; }
    }
}

