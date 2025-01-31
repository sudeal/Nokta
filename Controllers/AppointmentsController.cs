using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nokta_API;

namespace Nokta_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Appointments
        /// <summary>
        /// Retrieves all appointments.
        /// </summary>
        /// <returns>List of all appointments</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAllAppointments()
        {
            var appointments = await _context.Appointments.ToListAsync();

            if (!appointments.Any())
            {
                return NotFound("No appointments found.");
            }

            return Ok(appointments);
        }

        // GET: api/Appointments/{id}
        /// <summary>
        /// Retrieves a specific appointment by ID.
        /// </summary>
        /// <param name="id">The ID of the appointment</param>
        /// <returns>An appointment</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            return Ok(appointment);
        }

        // GET: api/Appointments/business/{businessId}
        /// <summary>
        /// Retrieves all appointments for a specific business.
        /// </summary>
        /// <param name="businessId">The ID of the business</param>
        /// <returns>List of appointments</returns>
        [HttpGet("business/{businessId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByBusiness(int businessId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.BusinessID == businessId)
                .ToListAsync();

            if (!appointments.Any())
            {
                return NotFound("No appointments found for this business.");
            }

            return Ok(appointments);
        }

        // GET: api/Appointments/business/{businessId}/date/{date}
        /// <summary>
        /// Retrieves all appointments for a specific business on a specific date.
        /// </summary>
        /// <param name="businessId">The ID of the business</param>
        /// <param name="date">The date to filter appointments</param>
        /// <returns>List of appointments</returns>
        [HttpGet("business/{businessId}/date/{date}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByBusinessAndDate(int businessId, DateTime date)
        {
            var appointments = await _context.Appointments
                .Where(a => a.BusinessID == businessId && a.AppointmentDateTime.Date == date.Date)
                .ToListAsync();

            if (!appointments.Any())
            {
                return NotFound("No appointments found for this business on the selected date.");
            }

            return Ok(appointments);
        }

        // POST: api/Appointments
        /// <summary>
        /// Creates a new appointment if the requested time is available.
        /// </summary>
        /// <param name="appointment">The appointment details</param>
        /// <returns>Success or failure message</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<Appointment>> CreateAppointment([FromBody] Appointment appointment)
        {
            if (appointment == null)
            {
                return BadRequest("Appointment details cannot be null.");
            }

            // Kullanıcı ve İşletme doğrulaması
            var userExists = await _context.Users.AnyAsync(u => u.UserID == appointment.UserID);
            if (!userExists)
            {
                return BadRequest("User not found.");
            }

            var business = await _context.Businesses.FindAsync(appointment.BusinessID);
            if (business == null)
            {
                return BadRequest("Business not found.");
            }

            // İşletme saatleri kontrolü
            double appointmentHour = appointment.AppointmentDateTime.TimeOfDay.TotalHours;
            if (appointmentHour < business.OpeningHour || appointmentHour >= business.ClosingHour)
            {
                return BadRequest("The appointment time is outside the business's operating hours.");
            }

            // Çakışma kontrolü
            bool isTimeSlotTaken = await _context.Appointments.AnyAsync(a =>
                a.BusinessID == appointment.BusinessID &&
                a.AppointmentDateTime == appointment.AppointmentDateTime);

            if (isTimeSlotTaken)
            {
                return Conflict("The selected time slot is already booked.");
            }

            // Randevuyu kaydet
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppointment", new { id = appointment.AppointmentID }, appointment);
        }

        // DELETE: api/Appointments/{id}
        /// <summary>
        /// Deletes an appointment by ID.
        /// </summary>
        /// <param name="id">The ID of the appointment</param>
        /// <returns>Success or failure message</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
