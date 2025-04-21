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
    public class CentroMedicoController : ControllerBase
    {
        private readonly HospitalContext _context;

        public CentroMedicoController(HospitalContext context)
        {
            _context = context;
        }

        // GET: api/CentroMedicoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CentroMedico>>> GetCentrosMedicos()
        {
            return await _context.CentrosMedicos.ToListAsync();
        }

        // GET: api/CentroMedicoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CentroMedico>> GetCentroMedico(int id)
        {
            var centroMedico = await _context.CentrosMedicos.FindAsync(id);

            if (centroMedico == null)
            {
                return NotFound();
            }

            return centroMedico;
        }

        // PUT: api/CentroMedicoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCentroMedico(int id, CentroMedico centroMedico)
        {
            if (id != centroMedico.CentroID)
            {
                return BadRequest();
            }

            _context.Entry(centroMedico).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CentroMedicoExists(id))
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

        // POST: api/CentroMedicoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CentroMedico>> PostCentroMedico(CentroMedico centroMedico)
        {
            _context.CentrosMedicos.Add(centroMedico);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCentroMedico", new { id = centroMedico.CentroID }, centroMedico);
        }

        // DELETE: api/CentroMedicoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCentroMedico(int id)
        {
            var centroMedico = await _context.CentrosMedicos.FindAsync(id);
            if (centroMedico == null)
            {
                return NotFound();
            }

            _context.CentrosMedicos.Remove(centroMedico);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CentroMedicoExists(int id)
        {
            return _context.CentrosMedicos.Any(e => e.CentroID == id);
        }
    }
}
