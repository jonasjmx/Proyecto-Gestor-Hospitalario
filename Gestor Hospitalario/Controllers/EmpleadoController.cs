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
        public async Task<ActionResult<IEnumerable<EmpleadoReadDTO>>> ListarEmpleados()
        {
            var empleados = await _context.Empleados
                                          .Include(e => e.CentroMedico)
                                          .ToListAsync();

            var lista = empleados.Select(e => new EmpleadoReadDTO
            {
                EmpleadoID = e.EmpleadoID,
                Nombre = e.Nombre,
                Apellido = e.Apellido,
                Cargo = e.Cargo,
                Telefono = e.Telefono,
                Email = e.Email,
                CentroMedicoNombre = e.CentroMedico?.Nombre ?? string.Empty
            }).ToList();

            return Ok(lista);
        }


        /// <summary>
        /// Crear un nuevo empleado
        /// </summary>
        [HttpPost("Crear")]
        public async Task<ActionResult<EmpleadoReadDTO>> CrearEmpleado([FromBody] EmpleadoCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Verificar si ya existe un empleado con el mismo nombre y apellido (ignorando mayúsculas/minúsculas)
            bool empleadoExiste = await _context.Empleados
                .AnyAsync(e => e.Nombre.ToLower() == dto.Nombre.ToLower() && e.Apellido.ToLower() == dto.Apellido.ToLower());

            if (empleadoExiste)
                return Conflict($"Ya existe un empleado con el nombre '{dto.Nombre}' y apellido '{dto.Apellido}'.");

            var nuevoEmpleado = new Empleado
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Cargo = dto.Cargo,
                Telefono = dto.Telefono,
                Email = dto.Email,
                CentroID = dto.CentroID
            };

            _context.Empleados.Add(nuevoEmpleado);
            await _context.SaveChangesAsync();

            var result = new EmpleadoReadDTO
            {
                EmpleadoID = nuevoEmpleado.EmpleadoID,
                Nombre = nuevoEmpleado.Nombre,
                Apellido = nuevoEmpleado.Apellido,
                Cargo = nuevoEmpleado.Cargo,
                Telefono = nuevoEmpleado.Telefono,
                Email = nuevoEmpleado.Email,
                CentroMedicoNombre = nuevoEmpleado.CentroMedico?.Nombre ?? string.Empty
            };

            return CreatedAtAction(nameof(GetEmpleado), new { id = result.EmpleadoID }, result);
        }


        /// <summary>
        /// Obtener empleado por ID
        /// </summary>
        [HttpGet("Buscar/{id}")]
        public async Task<ActionResult<EmpleadoReadDTO>> GetEmpleado(int id)
        {
            var empleado = await _context.Empleados
                                         .Include(e => e.CentroMedico)
                                         .FirstOrDefaultAsync(e => e.EmpleadoID == id);

            if (empleado == null)
                return NotFound();

            var result = new EmpleadoReadDTO
            {
                EmpleadoID = empleado.EmpleadoID,
                Nombre = empleado.Nombre,
                Apellido = empleado.Apellido,
                Cargo = empleado.Cargo,
                Telefono = empleado.Telefono,
                Email = empleado.Email,
                CentroMedicoNombre = empleado.CentroMedico?.Nombre ?? string.Empty
            };

            return Ok(result);
        }

        /// <summary>
        /// Actualizar datos de un empleado
        /// </summary>
        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> ActualizarEmpleado(int id, [FromBody] EmpleadoUpdateDTO dto)
        {
            var empleado = await _context.Empleados.FindAsync(id);
            if (empleado == null)
                return NotFound();

            // Validar si otro empleado ya tiene el mismo nombre, apellido y correo electrónico
            bool existeEmpleadoConMismoDatos = await _context.Empleados
                .AnyAsync(e => e.EmpleadoID != id &&
                               e.Nombre.ToLower() == dto.Nombre.ToLower() &&
                               e.Apellido.ToLower() == dto.Apellido.ToLower() &&
                               e.Email!.ToLower() == dto.Email!.ToLower());

            if (existeEmpleadoConMismoDatos)
                return Conflict($"Ya existe otro empleado con el nombre '{dto.Nombre}', apellido '{dto.Apellido}' y email '{dto.Email}'.");

            // Actualizar datos
            empleado.Nombre = dto.Nombre;
            empleado.Apellido = dto.Apellido;
            empleado.Cargo = dto.Cargo;
            empleado.Telefono = dto.Telefono;
            empleado.Email = dto.Email;
            empleado.CentroID = dto.CentroID;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Eliminar un empleado por ID
        /// </summary>
        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarEmpleado(int id)
        {
            var empleado = await _context.Empleados.FindAsync(id);

            if (empleado == null)
                return NotFound($"No se encontró ningún empleado con el ID {id}.");

            _context.Empleados.Remove(empleado);
            await _context.SaveChangesAsync();

            return Ok($"Empleado con ID {id} eliminado exitosamente.");
        }

    }
}
