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
using System.Globalization;

namespace Gestor_Hospitalario.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsultaController : ControllerBase
    {
        private readonly HospitalContext _context;

        public ConsultaController(HospitalContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Listar todas las consultas médicas
        /// </summary>
        [HttpGet("Listar")]
        public async Task<ActionResult<IEnumerable<ConsultaReadDTO>>> ListarConsultasMedicas()
        {
            var consultas = await _context.ConsultasMedicas
                                           .Include(c => c.Medico) // Incluye la relación con Médico
                                           .ThenInclude(m => m.Centro) // Incluye la relación con Centro Médico a través de Médico
                                           .ToListAsync();

            var resultado = consultas.Select(consulta => new ConsultaReadDTO
            {
                ConsultaID = consulta.ConsultaID,
                FechaConsulta = consulta.FechaConsulta.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                Hora = consulta.HoraConsulta.ToString(@"hh\:mm"),
                PacienteNombre = consulta.Paciente?.Usuario?.Nombre ?? "",
                PacienteApellido = consulta.Paciente?.Usuario?.Apellido ?? "",
                MedicoNombre = consulta.Medico?.Usuario?.Nombre + " " + consulta.Medico?.Usuario?.Apellido,
                CentroMedicoNombre = consulta.Medico?.Centro?.Nombre // Aquí obtenemos el nombre del centro médico a través del médico
            }).ToList();

            return Ok(resultado);
        }



        /// <summary>
        /// Crear una nueva consulta médica
        /// </summary>
        [HttpPost("Crear")]
        public async Task<ActionResult<ConsultaReadDTO>> CrearConsultaMedica([FromBody] ConsultaCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var fechaRedondeada = dto.FechaConsulta.Date;
            var horaRedondeada = new TimeSpan(dto.HoraConsulta.Hours, dto.HoraConsulta.Minutes, 0);

            var consultaExistente = await _context.ConsultasMedicas.FirstOrDefaultAsync(c =>
                c.FechaConsulta == fechaRedondeada &&
                c.HoraConsulta == horaRedondeada &&
                c.MedicoID == dto.MedicoID &&
                c.PacienteID == dto.PacienteID
            );

            if (consultaExistente != null)
                return Conflict("Ya existe una consulta médica con esos datos.");

            var nuevaConsulta = new Consulta
            {
                FechaConsulta = fechaRedondeada,
                HoraConsulta = horaRedondeada,
                Diagnostico = dto.Diagnostico,
                Receta = dto.Receta,
                MedicoID = dto.MedicoID,
                PacienteID = dto.PacienteID
            };

            _context.ConsultasMedicas.Add(nuevaConsulta);
            await _context.SaveChangesAsync();

            // Cargar Médico (y su CentroMédico) para el ReadDTO
            await _context.Entry(nuevaConsulta).Reference(c => c.Medico).Query().Include(m => m.Centro).LoadAsync();
            await _context.Entry(nuevaConsulta).Reference(c => c.Paciente).Query().Include(p => p.Usuario).LoadAsync();

            var result = ConsultaReadDTO.FromModel(nuevaConsulta);

            return CreatedAtAction(nameof(GetConsultaMedica), new { id = result.ConsultaID }, result);
        }


        /// <summary>
        /// Obtener consulta médica por Id
        /// </summary>
        [HttpGet("Buscar/{id}")]
        public async Task<ActionResult<ConsultaReadDTO>> GetConsultaMedica(int id)
        {
            var consulta = await _context.ConsultasMedicas
                                         .Include(c => c.Medico) // Incluye la relación con Médico
                                         .ThenInclude(m => m.Centro) // Incluye la relación con Centro Médico a través de Médico
                                         .FirstOrDefaultAsync(c => c.ConsultaID == id);

            if (consulta == null)
                return NotFound();

            var result = new ConsultaReadDTO
            {
                ConsultaID = consulta.ConsultaID,
                FechaConsulta = consulta.FechaConsulta.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                Hora = consulta.HoraConsulta.ToString(@"hh\:mm"),
                PacienteNombre = consulta.Paciente?.Usuario?.Nombre ?? "",
                PacienteApellido = consulta.Paciente?.Usuario?.Apellido ?? "",
                MedicoNombre = consulta.Medico?.Usuario?.Nombre + " " + consulta.Medico?.Usuario?.Apellido,
                CentroMedicoNombre = consulta.Medico?.Centro?.Nombre // Aquí obtenemos el nombre del centro médico a través del médico
            };

            return Ok(result);
        }


        /// <summary>
        /// Actualizar datos de una consulta médica
        /// </summary>
        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> ActualizarConsultaMedica(int id, [FromBody] ConsultaUpdateDto dto)
        {
            var consulta = await _context.ConsultasMedicas.FindAsync(id);
            if (consulta == null)
                return NotFound("Consulta médica no encontrada.");

            var fechaRedondeada = dto.FechaConsulta.Date;
            var horaRedondeada = new TimeSpan(dto.HoraConsulta.Hours, dto.HoraConsulta.Minutes, 0);

            var consultaExistente = await _context.ConsultasMedicas
                .FirstOrDefaultAsync(c => c.ConsultaID != id &&
                                          c.FechaConsulta == fechaRedondeada &&
                                          c.HoraConsulta == horaRedondeada &&
                                          c.MedicoID == dto.MedicoID &&
                                          c.PacienteID == dto.PacienteID);

            if (consultaExistente != null)
                return Conflict("Ya existe una consulta médica con esos datos.");

            consulta.FechaConsulta = fechaRedondeada;
            consulta.HoraConsulta = horaRedondeada;
            consulta.Diagnostico = dto.Diagnostico;
            consulta.Receta = dto.Receta;
            consulta.MedicoID = dto.MedicoID;
            consulta.PacienteID = dto.PacienteID;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Eliminar una consulta médica por ID
        /// </summary>
        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarConsultaMedica(int id)
        {
            var consulta = await _context.ConsultasMedicas.FindAsync(id);
            if (consulta == null)
                return NotFound();

            _context.ConsultasMedicas.Remove(consulta);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

