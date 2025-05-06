using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gestor_Hospitalario.Context;
using Gestor_Hospitalario.Models;
using Gestor_Hospitalario.DTos;

namespace Gestor_Hospitalario.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadoController : ControllerBase
    {
        private readonly HospitalContext _context;

        public EmpleadoController(HospitalContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Listar todos los empleados
        /// </summary>
        [HttpGet("Listar")]
        public async Task<ActionResult<IEnumerable<EmpleadoGetDto>>> ListarEmpleados()
        {
            var empleados = await _context.Empleados
                                          .Include(e => e.Centro)
                                          .Select(e => new EmpleadoGetDto
                                          {
                                              EmpleadoID = e.EmpleadoID,
                                              Cargo = e.Cargo,
                                              UsuarioID = e.UsuarioID,
                                              NombreEmpleado = e.Usuario.Nombre + " " + e.Usuario.Apellido,
                                              CentroID = e.CentroID,
                                              NombreCentro = e.Centro.Nombre
                                          })
                                          .ToListAsync();

            return Ok(empleados);
        }

        /// <summary>
        /// Crear un nuevo empleado
        /// </summary>
        [HttpPost("Crear")]
        public async Task<ActionResult> CrearEmpleado([FromBody] EmpleadoCreateDto empleadoDto)
        {
            // Obtener el usuario asociado con el UsuarioID
            var usuario = await _context.Usuarios
                                         .FirstOrDefaultAsync(u => u.UsuarioID == empleadoDto.UsuarioID);

            if (usuario == null)
            {
                return BadRequest("El usuario asociado no existe.");
            }

            // Verificar si ya existe un empleado con el mismo nombre y apellido
            var existeEmpleado = await _context.Empleados
                                                .AnyAsync(e => e.Usuario.Nombre.Equals(usuario.Nombre, StringComparison.OrdinalIgnoreCase) &&
                                                               e.Usuario.Apellido.Equals(usuario.Apellido, StringComparison.OrdinalIgnoreCase));

            if (existeEmpleado)
            {
                return BadRequest("Ya existe un empleado con el mismo nombre y apellido.");
            }

            var empleado = new Empleado
            {
                Cargo = empleadoDto.Cargo,
                UsuarioID = empleadoDto.UsuarioID,
                CentroID = empleadoDto.CentroID
            };

            _context.Empleados.Add(empleado);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmpleado), new { id = empleado.EmpleadoID }, empleado);
        }


        /// <summary>
        /// Obtener empleado por ID
        /// </summary>
        [HttpGet("Buscar/{id}")]
        public async Task<ActionResult<EmpleadoGetDto>> GetEmpleado(int id)
        {
            var empleado = await _context.Empleados
                                          .Include(e => e.Centro)
                                          .FirstOrDefaultAsync(e => e.EmpleadoID == id);

            if (empleado == null)
            {
                return NotFound();
            }

            var empleadoDto = new EmpleadoGetDto
            {
                EmpleadoID = empleado.EmpleadoID,
                Cargo = empleado.Cargo,
                UsuarioID = empleado.UsuarioID,
                NombreEmpleado = empleado.Usuario.Nombre + " " + empleado.Usuario.Apellido,
                CentroID = empleado.CentroID,
                NombreCentro = empleado.Centro.Nombre
            };

            return Ok(empleadoDto);
        }

        /// <summary>
        /// Actualizar datos de un empleado
        /// </summary>
        [HttpPut("Actualizar/{id}")]
        public async Task<ActionResult> ActualizarEmpleado(int id, [FromBody] EmpleadoCreateDto empleadoDto)
        {
            // Obtener el empleado a actualizar
            var empleado = await _context.Empleados
                                         .Include(e => e.Usuario)
                                         .FirstOrDefaultAsync(e => e.EmpleadoID == id);

            if (empleado == null)
            {
                return NotFound("Empleado no encontrado.");
            }

            // Obtener el usuario que se va a asignar
            var usuario = await _context.Usuarios
                                        .FirstOrDefaultAsync(u => u.UsuarioID == empleadoDto.UsuarioID);

            if (usuario == null)
            {
                return BadRequest("El usuario asociado no existe.");
            }

            // Verificar si ya existe otro empleado con el mismo nombre y apellido
            var existeEmpleado = await _context.Empleados
                                               .Include(e => e.Usuario)
                                               .AnyAsync(e => e.EmpleadoID != id &&
                                                              e.Usuario.Nombre.Equals(usuario.Nombre, StringComparison.OrdinalIgnoreCase) &&
                                                              e.Usuario.Apellido.Equals(usuario.Apellido, StringComparison.OrdinalIgnoreCase));

            if (existeEmpleado)
            {
                return BadRequest("Ya existe un empleado con el mismo nombre y apellido.");
            }

            // Actualizar los campos
            empleado.Cargo = empleadoDto.Cargo;
            empleado.UsuarioID = empleadoDto.UsuarioID;
            empleado.CentroID = empleadoDto.CentroID;

            _context.Empleados.Update(empleado);
            await _context.SaveChangesAsync();

            return Ok(empleado);
        }


        /// <summary>
        /// Eliminar un empleado por ID
        /// </summary>
        [HttpDelete("Eliminar/{id}")]
        public async Task<ActionResult> EliminarEmpleado(int id)
        {
            var empleado = await _context.Empleados.FindAsync(id);

            if (empleado == null)
            {
                return NotFound();
            }

            _context.Empleados.Remove(empleado);
            await _context.SaveChangesAsync();

            return NoContent(); // Devuelve un código 204 si la eliminación fue exitosa
        }
    }

}
