namespace Gestor_Hospitalario.Models
{
    public class Usuario
    {
        public int UsuarioID { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public SexoEnum Sexo { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public RolEnum Rol { get; set; }

    }
    // Enumeración que define los valores válidos para el campo 'Sexo' en la base de datos.

    public enum SexoEnum
    {
        Masculino,
        Femenino
    }
    public enum RolEnum
    {
        Administrador,
        Medico,
        Paciente
    }
}