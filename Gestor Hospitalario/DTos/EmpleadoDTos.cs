namespace Gestor_Hospitalario.DTos
{
    public class EmpleadoCreateDto
    {
        public string Cargo { get; set; }
        public int UsuarioID { get; set; }
        public int CentroID { get; set; }
    }

    public class EmpleadoGetDto
    {
        public int EmpleadoID { get; set; }
        public string Cargo { get; set; }
        public int UsuarioID { get; set; }
        public string NombreEmpleado { get; set; }
        public int CentroID { get; set; }
        public string NombreCentro { get; set; }
    }

}

