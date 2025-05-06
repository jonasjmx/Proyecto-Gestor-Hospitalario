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

            // Verificar que el usuario exista
            var usuario = await _context.Usuarios.FindAsync(dto.UsuarioID);
            if (usuario == null)
                return NotFound($"No se encontró el usuario con ID {dto.UsuarioID}.");

            // Crear médico
            var nuevoMedico = new Medico
            {
                UsuarioID = dto.UsuarioID,
                EspecialidadID = dto.EspecialidadID,
                CentroID = dto.CentroID
            };

            _context.Medicos.Add(nuevoMedico);
            await _context.SaveChangesAsync();

            var especialidad = await _context.Especialidades.FindAsync(dto.EspecialidadID);
            var centro = await _context.CentrosMedicos.FindAsync(dto.CentroID);

            var result = new MedicoReadDTO
            {
                MedicoID = nuevoMedico.MedicoID,
                Nombre = usuario.Nombre,
                Apellido = usuario.Apellido,
                Telefono = usuario.Telefono,
                Email = usuario.Email,
                EspecialidadNombre = especialidad?.Nombre ?? "",
                CentroNombre = centro?.Nombre ?? ""
            };

            return CreatedAtAction(nameof(ObtenerMedico), new { id = result.MedicoID }, result);
        }



        // Fix for the CS1061 error in the ObtenerMedico method
        [HttpGet("Buscar/{id}")]
        public async Task<ActionResult<MedicoReadDTO>> ObtenerMedico(int id)
        {
            var medico = await _context.Medicos
                .Include(m => m.Usuario)
                .Include(m => m.Especialidad)
                .Include(m => m.Centro) // Corrected: Include the Centro navigation property instead of CentroID
                .FirstOrDefaultAsync(m => m.MedicoID == id);

            if (medico == null)
                return NotFound();

            var dto = new MedicoReadDTO
            {
                MedicoID = medico.MedicoID,
                Nombre = medico.Usuario?.Nombre ?? "",
                Apellido = medico.Usuario?.Apellido ?? "",
                Telefono = medico.Usuario?.Telefono ?? "",
                Email = medico.Usuario?.Email ?? "",
                EspecialidadNombre = medico.Especialidad?.Nombre ?? "",
                CentroNombre = medico.Centro?.Nombre ?? "" // Corrected: Access the Nombre property of the Centro navigation property
            };

            return Ok(dto);
        }



        // Obtener todos los médicos
        [HttpGet("Listar")]
        public async Task<ActionResult<IEnumerable<MedicoReadDTO>>> ListarMedicos()
        {
            var medicos = await _context.Medicos
                                        .Include(m => m.Usuario)
                                        .Include(m => m.Especialidad)
                                        .Include(m => m.CentroID)
                                        .ToListAsync();

            var dtos = medicos.Select(m => new MedicoReadDTO
            {
                MedicoID = m.MedicoID,
                Nombre = m.Usuario?.Nombre ?? "",
                Apellido = m.Usuario?.Apellido ?? "",
                Telefono = m.Usuario?.Telefono ?? "",
                Email = m.Usuario?.Email ?? "",
                EspecialidadNombre = m.Especialidad?.Nombre ?? "",
                CentroNombre = m.Centro?.Nombre ?? ""
            });

            return Ok(dtos);
        }


        // Actualizar un médico
        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> ActualizarMedico(int id, [FromBody] MedicoUpdateDTO dto)
        {
            var medico = await _context.Medicos.FindAsync(id);
            if (medico == null)
                return NotFound();

            var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.UsuarioID == dto.UsuarioID);
            var especialidadExiste = await _context.Especialidades.AnyAsync(e => e.EspecialidadID == dto.EspecialidadID);
            var centroExiste = await _context.CentrosMedicos.AnyAsync(c => c.CentroID == dto.CentroID);

            if (!usuarioExiste || !especialidadExiste || !centroExiste)
                return BadRequest("Usuario, especialidad o centro no válidos.");

            medico.UsuarioID = dto.UsuarioID;
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

