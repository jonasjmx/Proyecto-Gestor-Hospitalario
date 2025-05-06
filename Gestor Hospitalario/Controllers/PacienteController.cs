using Gestor_Hospitalario.Context;
using Gestor_Hospitalario.DTos;
using Gestor_Hospitalario.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Gestor_Hospitalario.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PacienteController : ControllerBase
    {
        private readonly HospitalContext _context;

        public PacienteController(HospitalContext context)
        {
            _context = context;
        }

        [HttpPost("Crear")]
        public async Task<ActionResult<PacienteReadDTO>> CrearPaciente([FromBody] PacienteCreateDTO dto)
        {
            var nuevoUsuario = new Usuario
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Sexo = Enum.Parse<SexoEnum>(dto.Sexo, true), // Convertir string a SexoEnum
                Email = dto.Email,
                FechaNacimiento = dto.FechaNacimiento,
                Direccion = dto.Direccion,
                Telefono = dto.Telefono,
                Password = dto.Password
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            var paciente = new Paciente
            {
                UsuarioID = nuevoUsuario.UsuarioID,
                FechaRegistro = DateTime.Now // Agregar la fecha de registro al crear el paciente
            };

            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(BuscarPaciente), new { id = paciente.PacienteID }, new PacienteReadDTO
            {
                PacienteID = paciente.PacienteID,
                Nombre = nuevoUsuario.Nombre,
                Apellido = nuevoUsuario.Apellido,
                Sexo = nuevoUsuario.Sexo.ToString(),
                Email = nuevoUsuario.Email,
                FechaNacimiento = nuevoUsuario.FechaNacimiento,
                Direccion = nuevoUsuario.Direccion,
                Telefono = nuevoUsuario.Telefono
            });
        }

        [HttpGet("Buscar/{id}")]
        public async Task<ActionResult<PacienteReadDTO>> BuscarPaciente(int id)
        {
            var paciente = await _context.Pacientes
                                         .Include(p => p.Usuario)
                                         .FirstOrDefaultAsync(p => p.PacienteID == id);

            if (paciente == null)
                return NotFound();

            return Ok(new PacienteReadDTO
            {
                PacienteID = paciente.PacienteID,
                Nombre = paciente.Usuario?.Nombre ?? "",
                Apellido = paciente.Usuario?.Apellido ?? "",
                Sexo = paciente.Usuario?.Sexo.ToString() ?? "", // Usar Sexo en lugar de Genero
                Email = paciente.Usuario?.Email ?? "",
                FechaNacimiento = paciente.Usuario?.FechaNacimiento ?? DateTime.MinValue,
                Direccion = paciente.Usuario?.Direccion ?? "",
                Telefono = paciente.Usuario?.Telefono ?? ""
            });
        }

        [HttpGet("Listar")]
        public async Task<ActionResult<IEnumerable<PacienteReadDTO>>> ListarPacientes()
        {
            var pacientes = await _context.Pacientes
                                          .Include(p => p.Usuario)
                                          .ToListAsync();

            var dtos = pacientes.Select(p => new PacienteReadDTO
            {
                PacienteID = p.PacienteID,
                Nombre = p.Usuario?.Nombre ?? "",
                Apellido = p.Usuario?.Apellido ?? "",
                Sexo = p.Usuario?.Sexo.ToString() ?? "", // Usar Sexo en lugar de Genero
                Email = p.Usuario?.Email ?? "",
                FechaNacimiento = p.Usuario?.FechaNacimiento ?? DateTime.MinValue,
                Direccion = p.Usuario?.Direccion ?? "",
                Telefono = p.Usuario?.Telefono ?? ""
            });

            return Ok(dtos);
        }

        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> ActualizarPaciente(int id, [FromBody] PacienteCreateDTO dto)
        {
            var paciente = await _context.Pacientes
                                         .Include(p => p.Usuario)
                                         .FirstOrDefaultAsync(p => p.PacienteID == id);

            if (paciente == null)
                return NotFound();

            var usuario = paciente.Usuario;
            if (usuario == null)
                return BadRequest("No se encontró el usuario relacionado.");

            usuario.Nombre = dto.Nombre;
            usuario.Apellido = dto.Apellido;
            usuario.Sexo = Enum.Parse<SexoEnum>(dto.Sexo, true); // Convertir string a SexoEnum
            usuario.Email = dto.Email;
            usuario.FechaNacimiento = dto.FechaNacimiento;
            usuario.Direccion = dto.Direccion;
            usuario.Telefono = dto.Telefono;
            usuario.Password = dto.Password;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarPaciente(int id)
        {
            var paciente = await _context.Pacientes
                                         .Include(p => p.Usuario)
                                         .FirstOrDefaultAsync(p => p.PacienteID == id);

            if (paciente == null)
                return NotFound();

            var usuario = paciente.Usuario;

            _context.Pacientes.Remove(paciente);
            if (usuario != null)
                _context.Usuarios.Remove(usuario);

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }


}
