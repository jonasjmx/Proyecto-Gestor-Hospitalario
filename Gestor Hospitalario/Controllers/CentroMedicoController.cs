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
    public class CentrosMedicosController : ControllerBase
    {
        private readonly HospitalContext _context;

        public CentrosMedicosController(HospitalContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lista todos los centros médicos registrados.
        /// </summary>
        [HttpGet("Listar")]
        public async Task<ActionResult<IEnumerable<CentroMedico>>> GetCentros()
        {
            return await _context.CentrosMedicos.ToListAsync();
        }

        /// <summary>
        /// Obtiene un centro médico por su ID.
        /// </summary>
        [HttpGet("Buscar/{id}")]
        public async Task<ActionResult<CentroMedico>> GetCentro(int id)
        {
            var centro = await _context.CentrosMedicos.FindAsync(id);
            if (centro == null)
                return NotFound();

            return centro;
        }

        /// <summary>
        /// Crea un nuevo centro médico (evita duplicados por nombre y dirección).
        /// </summary>
        [HttpPost("Crear")]
        public async Task<IActionResult> CrearCentro([FromBody] CentroMedicoCreateDTO dto)
        {
            var existe = await _context.CentrosMedicos
                .AnyAsync(c => c.Nombre == dto.Nombre && c.Direccion == dto.Direccion);

            if (existe)
                return Conflict("Ya existe un centro médico con ese nombre y dirección.");

            var nuevo = new CentroMedico
            {
                Nombre = dto.Nombre,
                Direccion = dto.Direccion,
                Telefono = dto.Telefono,
                Email = dto.Email
            };

            _context.CentrosMedicos.Add(nuevo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCentro), new { id = nuevo.CentroID }, nuevo);
        }

        /// <summary>
        /// Actualiza los datos de un centro médico existente.
        /// </summary>
        [HttpPut("Actualizar/{id}")]
        public async Task<IActionResult> ActualizarCentro(int id, [FromBody] CentroMedicoUpdateDTO dto)
        {
            var centro = await _context.CentrosMedicos.FindAsync(id);
            if (centro == null)
                return NotFound();

            var duplicado = await _context.CentrosMedicos
                .AnyAsync(c => c.Nombre == dto.Nombre && c.Direccion == dto.Direccion && c.CentroID != id);

            if (duplicado)
                return Conflict("Otro centro médico ya tiene ese nombre y dirección.");

            centro.Nombre = dto.Nombre;
            centro.Direccion = dto.Direccion;
            centro.Telefono = dto.Telefono;
            centro.Email = dto.Email;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Elimina un centro médico por ID.
        /// </summary>
        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarCentro(int id)
        {
            var centro = await _context.CentrosMedicos.FindAsync(id);
            if (centro == null)
                return NotFound();

            _context.CentrosMedicos.Remove(centro);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
