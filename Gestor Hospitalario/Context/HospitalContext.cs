using Gestor_Hospitalario.Models;
using Microsoft.EntityFrameworkCore;

namespace Gestor_Hospitalario.Context
{
    public class HospitalContext:DbContext
    {

        public HospitalContext(DbContextOptions<HospitalContext> options) : base(options) { }

        public DbSet<CentroMedico> CentrosMedicos { get; set; }
        public DbSet<Especialidad> Especialidades { get; set; }
        public DbSet<Medico> Medicos { get; set; }
        public DbSet<Empleado> Empleados { get; set; }
        public DbSet<ConsultaMedica> ConsultasMedicas { get; set; }

    }
}
