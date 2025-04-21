using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gestor_Hospitalario.Context;
using Gestor_Hospitalario.Models;

namespace Gestor_Hospitalario.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsultaMedicasController : ControllerBase
    {
        private readonly HospitalContext _context;

        public ConsultaMedicasController(HospitalContext context)
        {
            _context = context;
        }

        // GET: api/ConsultaMedicas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConsultaMedica>>> GetConsultasMedicas()
        {
            return await _context.ConsultasMedicas.ToListAsync();
        }

        // GET: api/ConsultaMedicas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ConsultaMedica>> GetConsultaMedica(int id)
        {
            var consultaMedica = await _context.ConsultasMedicas.FindAsync(id);

            if (consultaMedica == null)
            {
                return NotFound();
            }

            return consultaMedica;
        }

        // PUT: api/ConsultaMedicas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsultaMedica(int id, ConsultaMedica consultaMedica)
        {
            if (id != consultaMedica.ConsultaID)
            {
                return BadRequest();
            }

            _context.Entry(consultaMedica).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConsultaMedicaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ConsultaMedicas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ConsultaMedica>> PostConsultaMedica(ConsultaMedica consultaMedica)
        {
            _context.ConsultasMedicas.Add(consultaMedica);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetConsultaMedica", new { id = consultaMedica.ConsultaID }, consultaMedica);
        }

        // DELETE: api/ConsultaMedicas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsultaMedica(int id)
        {
            var consultaMedica = await _context.ConsultasMedicas.FindAsync(id);
            if (consultaMedica == null)
            {
                return NotFound();
            }

            _context.ConsultasMedicas.Remove(consultaMedica);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConsultaMedicaExists(int id)
        {
            return _context.ConsultasMedicas.Any(e => e.ConsultaID == id);
        }
    }
}
