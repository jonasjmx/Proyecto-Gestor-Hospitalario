namespace Gestor_Hospitalario.DTos
{
    // DTO para crear una especialidad
    public class EspecialidadCreateDTO
    {
        public required string Nombre { get; set; }
    }

    // DTO para lectura de especialidades
    public class EspecialidadReadDTO
    {
        public int EspecialidadID { get; set; }
        public string Nombre { get; set; }

    }

    // DTO para actualizar especialidad
    public class EspecialidadUpdateDTO
    {
        public required string Nombre { get; set; }
    }
}
