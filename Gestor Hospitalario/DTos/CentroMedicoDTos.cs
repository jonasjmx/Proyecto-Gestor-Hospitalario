namespace Gestor_Hospitalario.DTos
{ 
    // DTO para crear un centro médico
    public class CentroMedicoCreateDTO
    {
        public required string Nombre { get; set; }
        public string Direccion { get; set; } = string.Empty;
        public required string Telefono { get; set; }
        public required string Email { get; set; }
    }

    // DTO para mostrar info (lectura)
    public class CentroMedicoReadDTO
    {
        public int CentroID { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
    }

    // DTO para actualizar
    public class CentroMedicoUpdateDTO
    {
        public required string Nombre { get; set; }
        public string Direccion { get; set; } = string.Empty;
        public required string Telefono { get; set; }
        public required string Email { get; set; }
    }
}


