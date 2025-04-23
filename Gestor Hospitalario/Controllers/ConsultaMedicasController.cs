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
    public class ConsultaMedicaController : ControllerBase
    {
        private readonly HospitalContext _context;

        public ConsultaMedicaController(HospitalContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Crear una nueva consulta médica
        /// </summary>
        [HttpPost("Crear")]
        public async Task<ActionResult<ConsultaMedicaReadDTO>> CrearConsultaMedica([FromBody] ConsultaMedicaCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var fechaRedondeada = dto.Fecha.Date;
            var horaRedondeada = new TimeSpan(dto.Hora.Hours, dto.Hora.Minutes, 0);

            // Verificar si existe UNA consulta médica exactamente igual
            var consultaExistente = await _context.ConsultasMedicas.FirstOrDefaultAsync(c =>
                c.Fecha.Date == fechaRedondeada &&
                c.Hora.Hours == horaRedondeada.Hours &&
                c.Hora.Minutes == horaRedondeada.Minutes &&
                c.CentroID == dto.CentroMedicoID &&
                c.MedicoID == dto.MedicoID &&
                c.Ubicacion == dto.Ubicacion &&
                c.PacienteNombre == dto.PacienteNombre &&
                c.PacienteApellido == dto.PacienteApellido
            );

            if (consultaExistente != null)
                return Conflict("Ya existe una consulta médica con exactamente los mismos datos.");

            var nuevaConsulta = new ConsultaMedica
            {
                Fecha = fechaRedondeada,
                Hora = horaRedondeada,
                PacienteNombre = dto.PacienteNombre,
                PacienteApellido = dto.PacienteApellido,
                Ubicacion = dto.Ubicacion,
                MedicoID = dto.MedicoID,
                CentroID = dto.CentroMedicoID
            };

            _context.ConsultasMedicas.Add(nuevaConsulta);
            await _context.SaveChangesAsync();

            // Cargar relaciones
            await _context.Entry(nuevaConsulta).Reference(c => c.Medico).LoadAsync();
            await _context.Entry(nuevaConsulta).Reference(c => c.CentroMedico).LoadAsync();

            var result = new ConsultaMedicaReadDTO
            {
                ConsultaID = nuevaConsulta.ConsultaID,
                Fecha = nuevaConsulta.Fecha,
                Hora = nuevaConsulta.Hora,
                PacienteNombre = nuevaConsulta.PacienteNombre,
                PacienteApellido = nuevaConsulta.PacienteApellido,
                Ubicacion = nuevaConsulta.Ubicacion,
                MedicoNombre = nuevaConsulta.Medico?.Nombre ?? "",
                CentroMedicoNombre = nuevaConsulta.CentroMedico?.Nombre ?? ""
            };

            return CreatedAtAction(nameof(GetConsultaMedica), new { id = result.ConsultaID }, result);
        }



        /// <summary>
        /// Obtener consulta médica por Id
        /// </summary>
        [HttpGet("Buscar/{id}")]
        public async Task<ActionResult<ConsultaMedicaReadDTO>> GetConsultaMedica(int id)
        {
            var consulta = await _context.ConsultasMedicas
                                         .Include(c => c.Medico)
                                         .Include(c => c.CentroMedico)
                                         .FirstOrDefaultAsync(c => c.ConsultaID == id);

            if (consulta == null)
                return NotFound();

            var result = new ConsultaMedicaReadDTO
            {
                ConsultaID = consulta.ConsultaID,
                Fecha = consulta.Fecha,
                Hora = consulta.Hora,
                PacienteNombre = consulta.PacienteNombre,
                PacienteApellido = consulta.PacienteApellido,
                Ubicacion = consulta.Ubicacion,
                MedicoNombre = consulta.Medico.Nombre,
                CentroMedicoNombre = consulta.CentroMedico.Nombre
            };

            return Ok(result);
        }

        /// <summary>
        /// Actualizar datos de una consulta médica
        /// </summary>
        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> ActualizarConsultaMedica(int id, [FromBody] ConsultaMedicaUpdateDTO dto)
        {
            var consulta = await _context.ConsultasMedicas.FindAsync(id);
            if (consulta == null)
                return NotFound();

            // Verificar si ya existe una consulta médica con los mismos parámetros (fecha, hora, médico, centro médico, ubicación)
            var consultaExistente = await _context.ConsultasMedicas
                .FirstOrDefaultAsync(c => c.ConsultaID != id &&
                                          c.Fecha == dto.Fecha &&
                                          c.Hora == dto.Hora &&
                                          c.CentroID == dto.CentroMedicoID &&
                                          c.MedicoID == dto.MedicoID &&
                                          c.Ubicacion == dto.Ubicacion);

            if (consultaExistente != null)
                return Conflict("Ya existe una consulta médica con el mismo médico, hora, centro médico y ubicación.");

            // Actualización de los datos de la consulta médica
            consulta.Fecha = dto.Fecha;
            consulta.Hora = dto.Hora;
            consulta.PacienteNombre = dto.PacienteNombre;
            consulta.PacienteApellido = dto.PacienteApellido;
            consulta.Ubicacion = dto.Ubicacion;
            consulta.MedicoID = dto.MedicoID;
            consulta.CentroID = dto.CentroMedicoID;

            await _context.SaveChangesAsync();
            return NoContent();
        }


        /// <summary>
        /// Eliminar una consulta médica por ID
        /// </summary>
        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarConsultaMedica(int id)
        {
            // Buscar la consulta médica por el ID proporcionado
            var consulta = await _context.ConsultasMedicas.FindAsync(id);

            // Si no se encuentra la consulta, devolver NotFound
            if (consulta == null)
                return NotFound();

            // Eliminar la consulta médica de la base de datos
            _context.ConsultasMedicas.Remove(consulta);
            await _context.SaveChangesAsync();

            // Devolver NoContent como respuesta exitosa
            return NoContent();
        }

    }
}
