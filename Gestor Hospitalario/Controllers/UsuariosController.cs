using Gestor_Hospitalario.Context;
using Gestor_Hospitalario.DTos;
using Gestor_Hospitalario.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Gestor_Hospitalario.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly HospitalContext _context;

        public UsuariosController(HospitalContext context)
        {
            _context = context;
        }

        // LOGIN
        [HttpPost("Login")]
        public async Task<ActionResult<UsuarioLoginResponseDTO>> Login([FromBody] UsuarioLoginRequestDTO dto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password);

            if (usuario == null)
                return NotFound("Usuario o contraseña incorrectos.");

            return Ok(new UsuarioLoginResponseDTO
            {
                UsuarioID = usuario.UsuarioID,
                Nombre = usuario.Nombre,
                Rol = usuario.Rol.ToString()
            });

        }

        // Corrección en el método CrearUsuario para evitar la inicialización duplicada del miembro 'Nombre'.
        [HttpPost("Crear")]
        public async Task<ActionResult<UsuarioReadDTO>> CrearUsuario([FromBody] UsuarioCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var usuario = new Usuario
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Telefono = dto.Telefono,
                Email = dto.Email,
                Password = dto.Password,
                Rol = dto.Rol
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var result = new UsuarioReadDTO
            {
                UsuarioID = usuario.UsuarioID,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Telefono = usuario.Telefono,
                Email = usuario.Email,
                Rol = usuario.Rol.ToString() // Eliminada la inicialización duplicada de 'Nombre'.
            };

            return CreatedAtAction(nameof(ObtenerUsuario), new { id = result.UsuarioID }, result);
        }

        // BUSCAR USUARIO
        [HttpGet("Buscar/{id}")]
        public async Task<ActionResult<UsuarioReadDTO>> ObtenerUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound();

            return Ok(new UsuarioReadDTO
            {
                UsuarioID = usuario.UsuarioID,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Telefono = usuario.Telefono,
                Email = usuario.Email,
                Rol = usuario.Rol.ToString()
            });
        }

        // LISTAR USUARIOS
        [HttpGet("Listar")]
        public async Task<ActionResult<IEnumerable<UsuarioReadDTO>>> ListarUsuarios()
        {
            var usuarios = await _context.Usuarios.ToListAsync();

            var dtos = usuarios.Select(u => new UsuarioReadDTO
            {
                UsuarioID = u.UsuarioID,
                Nombre = u.Nombre,
                Apellido = u.Apellido,
                Telefono = u.Telefono,
                Email = u.Email,
                Rol = u.Rol.ToString()
            });

            return Ok(dtos);
        }

        // Update the "ActualizarUsuario" method to correctly convert the string to the RolEnum type.
        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> ActualizarUsuario(int id, [FromBody] UsuarioUpdateDTO dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return NotFound();

            usuario.Nombre = dto.Nombre;
            usuario.Apellido = dto.Apellido;
            usuario.Telefono = dto.Telefono;
            usuario.Email = dto.Email;
            usuario.Password = dto.Password;

            // Convert the string to RolEnum using Enum.TryParse
            if (Enum.TryParse(dto.Rol, out RolEnum parsedRol))
            {
                usuario.Rol = parsedRol;
            }
            else
            {
                return BadRequest("El rol proporcionado no es válido.");
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ELIMINAR USUARIO
        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return NotFound();

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}


