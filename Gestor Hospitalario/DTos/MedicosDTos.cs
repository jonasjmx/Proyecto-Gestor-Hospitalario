namespace Gestor_Hospitalario.DTos
{
    // DTO para crear un médico
    public class MedicoCreateDTO
    {
        public required string Nombre { get; set; }
        public required string Apellido { get; set; }
        public required string Telefono { get; set; }
        public required string Email { get; set; }
        public required int EspecialidadID { get; set; }
        public required int CentroID { get; set; }
    }

    // DTO para mostrar info de un médico (lectura)
    public class MedicoReadDTO
    {
        public int MedicoID { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }

        // Info relacionada (solo para lectura)
        public string EspecialidadNombre { get; set; } = string.Empty;
        public string CentroNombre { get; set; } = string.Empty;
    }

    // DTO para actualizar un médico
    public class MedicoUpdateDTO
    {
        public required string Nombre { get; set; }
        public required string Apellido { get; set; }
        public required string Telefono { get; set; }
        public required string Email { get; set; }
        public required int EspecialidadID { get; set; }
        public required int CentroID { get; set; }
    }
}
