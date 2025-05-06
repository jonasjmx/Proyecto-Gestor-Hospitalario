using Gestor_Hospitalario.Models;
using Microsoft.EntityFrameworkCore;

namespace Gestor_Hospitalario.Context
{
    public class HospitalContext : DbContext
    {
        public HospitalContext(DbContextOptions<HospitalContext> options) : base(options) { }

        public DbSet<CentroMedico> CentrosMedicos { get; set; }
        public DbSet<Especialidad> Especialidades { get; set; }
        public DbSet<Medico> Medicos { get; set; }
        public DbSet<Empleado> Empleados { get; set; }
        public DbSet<Consulta> ConsultasMedicas { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Paciente> Pacientes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CentroMedico>().ToTable("CentrosMedicos");
            modelBuilder.Entity<Especialidad>().ToTable("Especialidades");
            modelBuilder.Entity<Medico>().ToTable("Medicos");
            modelBuilder.Entity<Empleado>().ToTable("Empleados");
            modelBuilder.Entity<Consulta>().ToTable("ConsultasMedicas");
            modelBuilder.Entity<Usuario>().ToTable("Usuarios");
            modelBuilder.Entity<Paciente>().ToTable("Pacientes");
        }
    }
}