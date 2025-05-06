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
    public class EspecialidadController : ControllerBase
    {
        private readonly HospitalContext _context;

        public EspecialidadController(HospitalContext context)
        {
            _context = context;
        }

        // Crear
        [HttpPost("Crear")]
        public async Task<ActionResult<EspecialidadReadDTO>> CrearEspecialidad([FromBody] EspecialidadCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existe = await _context.Especialidades.AnyAsync(e => e.Nombre == dto.Nombre);
            if (existe)
                return Conflict($"Ya existe una especialidad con el nombre '{dto.Nombre}'.");

            var nueva = new Especialidad { Nombre = dto.Nombre };
            _context.Especialidades.Add(nueva);
            await _context.SaveChangesAsync();

            var result = new EspecialidadReadDTO
            {
                EspecialidadID = nueva.EspecialidadID,
                Nombre = nueva.Nombre
            };

            return CreatedAtAction(nameof(ObtenerEspecialidad), new { id = result.EspecialidadID }, result);
        }

        // Obtener una por ID
        [HttpGet("Buscar/{id}")]
        public async Task<ActionResult<EspecialidadReadDTO>> ObtenerEspecialidad(int id)
        {
            var esp = await _context.Especialidades.FindAsync(id);
            if (esp == null)
                return NotFound();

            return Ok(new EspecialidadReadDTO
            {
                EspecialidadID = esp.EspecialidadID,
                Nombre = esp.Nombre
            });
        }

        // Listar todas
        [HttpGet("Listar")]
        public async Task<ActionResult<IEnumerable<EspecialidadReadDTO>>> ListarEspecialidades()
        {
            var lista = await _context.Especialidades
                                      .Select(e => new EspecialidadReadDTO
                                      {
                                          EspecialidadID = e.EspecialidadID,
                                          Nombre = e.Nombre
                                      })
                                      .ToListAsync();

            return Ok(lista);
        }

        // Actualizar
        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> ActualizarEspecialidad(int id, [FromBody] EspecialidadUpdateDTO dto)
        {
            var esp = await _context.Especialidades.FindAsync(id);
            if (esp == null)
                return NotFound();

            // Verificar duplicado
            var existe = await _context.Especialidades
                                       .AnyAsync(e => e.Nombre == dto.Nombre && e.EspecialidadID != id);

            if (existe)
                return Conflict($"Ya existe otra especialidad con el nombre '{dto.Nombre}'.");

            esp.Nombre = dto.Nombre;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Eliminar
        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarEspecialidad(int id)
        {
            var esp = await _context.Especialidades.FindAsync(id);
            if (esp == null)
                return NotFound();

            _context.Especialidades.Remove(esp);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
