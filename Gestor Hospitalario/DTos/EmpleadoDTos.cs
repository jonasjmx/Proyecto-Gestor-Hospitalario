namespace Gestor_Hospitalario.DTos
{
    // DTO para crear un empleado
    public class EmpleadoCreateDTO
    {
        public required string Nombre { get; set; }
        public required string Apellido { get; set; }
        public string? Cargo { get; set; }
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public required int CentroID { get; set; }
    }

    // DTO para mostrar info de un empleado (lectura)
    public class EmpleadoReadDTO
    {
        public int EmpleadoID { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string? Cargo { get; set; }
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public string CentroMedicoNombre { get; set; } = string.Empty;
    }
    // DTO para actualizar un empleado
    public class EmpleadoUpdateDTO
    {
        public required string Nombre { get; set; }
        public required string Apellido { get; set; }
        public string? Cargo { get; set; }
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public required int CentroID { get; set; }
    }

}
