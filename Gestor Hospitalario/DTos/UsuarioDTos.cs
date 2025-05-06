using Gestor_Hospitalario.Models;

namespace Gestor_Hospitalario.DTos
{
    public class UsuarioCreateDto
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public SexoEnum Sexo { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public required string DirecciOn { get; set; } // Fixed spelling: "Direccion" -> "Dirección"
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public RolEnum Rol { get; set; }
    }

    public class UsuarioReadDTO
    {
        public int UsuarioID { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string Rol { get; set; }
    }
    public class UsuarioUpdateDTO
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Rol { get; set; }
    }
    /// <summary>
    /// INGRESO DEL LOGIN
    /// </summary>
    public class UsuarioLoginRequestDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class UsuarioLoginResponseDTO
    {
        public int UsuarioID { get; set; }
        public string Nombre { get; set; }
        public string Rol { get; set; }  // "medico", "administrador", etc.
    }



}