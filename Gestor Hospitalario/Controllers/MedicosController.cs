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
    public class MedicoController : ControllerBase
    {
        private readonly HospitalContext _context;

        public MedicoController(HospitalContext context)
        {
            _context = context;
        }

        // Crear un médico
        [HttpPost("Crear")]
        public async Task<ActionResult<MedicoReadDTO>> CrearMedico([FromBody] MedicoCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validar que no exista un médico con el mismo nombre y apellido
            var medicoExistente = await _context.Medicos
                .FirstOrDefaultAsync(m => m.Nombre == dto.Nombre && m.Apellido == dto.Apellido);

            if (medicoExistente != null)
                return BadRequest($"Ya existe un médico con el nombre {dto.Nombre} {dto.Apellido}.");

            var nuevoMedico = new Medico
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Telefono = dto.Telefono,
                Email = dto.Email,
                EspecialidadID = dto.EspecialidadID,
                CentroID = dto.CentroID
            };

            _context.Medicos.Add(nuevoMedico);
            await _context.SaveChangesAsync();

            var result = new MedicoReadDTO
            {
                MedicoID = nuevoMedico.MedicoID,
                Nombre = nuevoMedico.Nombre,
                Apellido = nuevoMedico.Apellido,
                Telefono = nuevoMedico.Telefono ?? "",
                Email = nuevoMedico.Email ?? "",
                EspecialidadNombre = (await _context.Especialidades.FindAsync(nuevoMedico.EspecialidadID))?.Nombre ?? "",
                CentroNombre = (await _context.CentrosMedicos.FindAsync(nuevoMedico.CentroID))?.Nombre ?? ""
            };

            return CreatedAtAction(nameof(ObtenerMedico), new { id = result.MedicoID }, result);
        }


        // Obtener médico por ID
        [HttpGet("Buscar/{id}")]
        public async Task<ActionResult<MedicoReadDTO>> ObtenerMedico(int id)
        {
            var medico = await _context.Medicos
                                       .Include(m => m.Especialidad)
                                       .Include(m => m.CentroMedico)
                                       .FirstOrDefaultAsync(m => m.MedicoID == id);

            if (medico == null)
                return NotFound();

            var dto = new MedicoReadDTO
            {
                MedicoID = medico.MedicoID,
                Nombre = medico.Nombre,
                Apellido = medico.Apellido,
                Telefono = medico.Telefono ?? "",
                Email = medico.Email ?? "",
                EspecialidadNombre = medico.Especialidad?.Nombre ?? "",
                CentroNombre = medico.CentroMedico?.Nombre ?? ""
            };

            return Ok(dto);
        }

        // Obtener todos los médicos
        [HttpGet("Listar")]
        public async Task<ActionResult<IEnumerable<MedicoReadDTO>>> ListarMedicos()
        {
            var medicos = await _context.Medicos
                                        .Include(m => m.Especialidad)
                                        .Include(m => m.CentroMedico)
                                        .ToListAsync();

            var dtos = medicos.Select(m => new MedicoReadDTO
            {
                MedicoID = m.MedicoID,
                Nombre = m.Nombre,
                Apellido = m.Apellido,
                Telefono = m.Telefono ?? "",
                Email = m.Email ?? "",
                EspecialidadNombre = m.Especialidad?.Nombre ?? "",
                CentroNombre = m.CentroMedico?.Nombre ?? ""
            });

            return Ok(dtos);
        }

        // Actualizar un médico
        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> ActualizarMedico(int id, [FromBody] MedicoUpdateDTO dto)
        {
            var medico = await _context.Medicos.FindAsync(id);
            if (medico == null)
                return NotFound($"No se encontró el médico con ID {id}.");

            // Validar que el Centro Médico exista
            var centroExiste = await _context.CentrosMedicos.AnyAsync(c => c.CentroID == dto.CentroID);
            if (!centroExiste)
                return BadRequest($"No existe un centro médico con ID {dto.CentroID}.");

            // Validar que la Especialidad exista
            var especialidadExiste = await _context.Especialidades.AnyAsync(e => e.EspecialidadID == dto.EspecialidadID);
            if (!especialidadExiste)
                return BadRequest($"No existe una especialidad con ID {dto.EspecialidadID}.");

            // Verificar que no exista otro médico con el mismo nombre y apellido (excluyendo al actual)
            var medicoExistente = await _context.Medicos
                .FirstOrDefaultAsync(m => m.MedicoID != id &&
                                          m.Nombre == dto.Nombre &&
                                          m.Apellido == dto.Apellido);

            if (medicoExistente != null)
                return Conflict("Ya existe otro médico con el mismo nombre y apellido.");

            // Actualizamos los datos
            medico.Nombre = dto.Nombre;
            medico.Apellido = dto.Apellido;
            medico.Telefono = dto.Telefono;
            medico.Email = dto.Email;
            medico.EspecialidadID = dto.EspecialidadID;
            medico.CentroID = dto.CentroID;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Elimina un médico por ID
        /// </summary>
        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarMedico(int id)
        {
            var medico = await _context.Medicos.FindAsync(id);
            if (medico == null)
                return NotFound($"No se encontró el médico con ID {id}.");

            _context.Medicos.Remove(medico);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
