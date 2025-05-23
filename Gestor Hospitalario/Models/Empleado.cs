﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Gestor_Hospitalario.Models
{
    public class Empleado
    {
        [Key]
        public int EmpleadoID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Cargo { get; set; }

        // Relación con la tabla Usuarios
        [Required]
        public int UsuarioID { get; set; }

        [ForeignKey("UsuarioID")]
        public Usuario Usuario { get; set; }

        // Relación con la tabla CentrosMedicos
        [Required]
        public int CentroID { get; set; }

        [ForeignKey("CentroID")]
        public CentroMedico Centro { get; set; }
    }
}