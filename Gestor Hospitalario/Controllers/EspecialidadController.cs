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
    public class EspecialidadesController : ControllerBase
    {
        private readonly HospitalContext _context;

        public EspecialidadesController(HospitalContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lista todas las especialidades registradas
        /// </summary>
        [HttpGet("Listar")]
        public async Task<ActionResult<IEnumerable<EspecialidadReadDTO>>> GetEspecialidades()
        {
            var especialidades = await _context.Especialidades.ToListAsync();
            var result = especialidades.Select(e => new EspecialidadReadDTO
            {
                EspecialidadID = e.EspecialidadID,
                Nombre = e.Nombre
            }).ToList();

            return Ok(result);
        }

        /// <summary>
        /// Obtener especialidad por Id
        /// </summary>
        [HttpGet("Buscar/{id}")]
        public async Task<ActionResult<EspecialidadReadDTO>> GetEspecialidad(int id)
        {
            var especialidad = await _context.Especialidades.FindAsync(id);
            if (especialidad == null)
                return NotFound();

            return new EspecialidadReadDTO
            {
                EspecialidadID = especialidad.EspecialidadID,
                Nombre = especialidad.Nombre
            };
        }

        /// <summary>
        /// Crear una nueva especialidad
        /// </summary>
        [HttpPost("Crear")]
        public async Task<ActionResult<EspecialidadReadDTO>> CrearEspecialidad([FromBody] EspecialidadCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validar si ya existe una especialidad con el mismo nombre (ignorando mayúsculas)
            bool yaExiste = await _context.Especialidades
                .AnyAsync(e => e.Nombre.ToLower() == dto.Nombre.ToLower());

            if (yaExiste)
                return Conflict($"Ya existe una especialidad con el nombre '{dto.Nombre}'.");

            var nueva = new Especialidad
            {
                Nombre = dto.Nombre
            };

            _context.Especialidades.Add(nueva);
            await _context.SaveChangesAsync();

            var result = new EspecialidadReadDTO
            {
                EspecialidadID = nueva.EspecialidadID,
                Nombre = nueva.Nombre,
            };

            return CreatedAtAction(nameof(GetEspecialidad), new { id = result.EspecialidadID }, result);
        }


        /// <summary>
        /// Actualizar datos de una especialidad
        /// </summary>
        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> ActualizarEspecialidad(int id, [FromBody] EspecialidadUpdateDTO dto)
        {
            var especialidad = await _context.Especialidades.FindAsync(id);
            if (especialidad == null)
                return NotFound();

            // Verificar si ya existe otra especialidad con el mismo nombre (ignorando mayúsculas)
            bool nombreDuplicado = await _context.Especialidades
                .AnyAsync(e => e.Nombre.ToLower() == dto.Nombre.ToLower() && e.EspecialidadID != id);

            if (nombreDuplicado)
                return Conflict($"Ya existe otra especialidad con el nombre '{dto.Nombre}'.");

            especialidad.Nombre = dto.Nombre;

            await _context.SaveChangesAsync();
            return NoContent();
        }


        /// <summary>
        /// Eliminar una especialidad por ID
        /// </summary>
        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarEspecialidad(int id)
        {
            var especialidad = await _context.Especialidades.FindAsync(id);
            if (especialidad == null)
                return NotFound($"No se encontró ninguna especialidad con ID {id}.");

            _context.Especialidades.Remove(especialidad);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
