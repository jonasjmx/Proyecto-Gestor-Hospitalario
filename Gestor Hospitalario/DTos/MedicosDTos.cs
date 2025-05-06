namespace Gestor_Hospitalario.DTos
{
    public class MedicoCreateDTO
    {
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public int EspecialidadID { get; set; }
        public int CentroID { get; set; }

        public int UsuarioID { get; set; } // ID del usuario que se relaciona con el médico 
    }


    public class MedicoGetDto
    {
        public int MedicoID { get; set; }
        public int EspecialidadID { get; set; }
        public string NombreEspecialidad { get; set; }
        public int CentroID { get; set; }
        public string NombreCentro { get; set; }
        public int UsuarioID { get; set; }
        public string NombreMedico { get; set; }
    }
    public class MedicoReadDTO
    {
        public int MedicoID { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Estos campos son resultado de las relaciones
        public string EspecialidadNombre { get; set; } = string.Empty;
        public string CentroNombre { get; set; } = string.Empty;
    }
    public class MedicoUpdateDTO
    {
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public int EspecialidadID { get; set; }
        public int CentroID { get; set; }
        public int UsuarioID { get; set; } // ID del usuario que se relaciona con el médico 

    }


}
