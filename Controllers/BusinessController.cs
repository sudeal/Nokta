using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nokta_API;
using System.Security.Cryptography;
using System.Text;

namespace Nokta_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class BusinessController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BusinessController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all businesses.
        /// </summary>
        /// <returns>List of businesses</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Business>>> GetBusinesses()
        {
            var businesses = await _context.Businesses.ToListAsync();

            if (!businesses.Any())
            {
                return NotFound("No businesses found.");
            }

            return Ok(businesses);
        }

        /// <summary>
        /// Retrieves a specific business by ID.
        /// </summary>
        /// <param name="id">The ID of the business</param>
        /// <returns>A business</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Business>> GetBusiness(int id)
        {
            var business = await _context.Businesses.FindAsync(id);

            if (business == null)
            {
                return NotFound("Business not found.");
            }

            return Ok(business);
        }

        /// <summary>
        /// Retrieves a business by email.
        /// </summary>
        /// <param name="email">The email of the business</param>
        /// <returns>A business</returns>
        [HttpGet("email/{email}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Business>> GetBusinessByEmail(string email)
        {
            var business = await _context.Businesses.FirstOrDefaultAsync(b => b.Email == email);

            if (business == null)
            {
                return NotFound("Business not found.");
            }

            return Ok(business);
        }

        /// <summary>
        /// Retrieves businesses by category.
        /// </summary>
        /// <param name="category">The category of businesses</param>
        /// <returns>List of businesses</returns>
        [HttpGet("category/{category}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Business>>> GetBusinessesByCategory(string category)
        {
            var businesses = await _context.Businesses.Where(b => b.Category == category).ToListAsync();

            if (!businesses.Any())
            {
                return NotFound("No businesses found in this category.");
            }

            return Ok(businesses);
        }

        /// <summary>
        /// Login for businesses.
        /// </summary>
        /// <param name="loginRequest">The email and password of the business</param>
        /// <returns>Login success or failure</returns>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest("Invalid login request.");
            }

            var business = await _context.Businesses.FirstOrDefaultAsync(b => b.Email == loginRequest.Email);
            if (business == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            using var sha256 = SHA256.Create();
            var hashedPassword = sha256.ComputeHash(Encoding.UTF8.GetBytes(loginRequest.Password));
            if (business.PasswordHash != Convert.ToBase64String(hashedPassword))
            {
                return Unauthorized("Invalid email or password.");
            }

            return Ok("Login successful.");
        }

        /// <summary>
        /// Register a new business.
        /// </summary>
        /// <param name="business">The business to register</param>
        /// <returns>The registered business</returns>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Business>> Register([FromBody] Business business)
        {
            if (business == null)
            {
                return BadRequest("Business cannot be null.");
            }

            if (await _context.Businesses.AnyAsync(b => b.Email == business.Email))
            {
                return Conflict("A business with this email already exists.");
            }

            using var sha256 = SHA256.Create();
            var hashedPassword = sha256.ComputeHash(Encoding.UTF8.GetBytes(business.PasswordHash));
            business.PasswordHash = Convert.ToBase64String(hashedPassword);

            business.webSiteTemplateID = DetermineWebSiteTemplateID(business);

            _context.Businesses.Add(business);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBusiness), new { id = business.BusinessID }, business);
        }

        /// <summary>
        /// Updates the details of a business.
        /// </summary>
        /// <param name="businessId">The ID of the business</param>
        /// <param name="updatedBusiness">The updated business details</param>
        /// <returns>Success or failure message</returns>
        [HttpPut("{businessId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateBusiness(int businessId, [FromBody] Business updatedBusiness)
        {
            var business = await _context.Businesses.FindAsync(businessId);

            if (business == null)
            {
                return NotFound("Business not found.");
            }

            business.Name = updatedBusiness.Name;
            business.OwnerName = updatedBusiness.OwnerName;
            business.Category = updatedBusiness.Category;
            business.Address = updatedBusiness.Address;
            business.Email = updatedBusiness.Email;
            business.ContactNumber = updatedBusiness.ContactNumber;
            business.hasMessaging = updatedBusiness.hasMessaging;
            business.hasStatistics = updatedBusiness.hasStatistics;
            business.hasMenuPrices = updatedBusiness.hasMenuPrices;
            business.hasDirections = updatedBusiness.hasDirections;
            business.OpeningHour = updatedBusiness.OpeningHour;
            business.ClosingHour = updatedBusiness.ClosingHour;

            int newTemplateID = DetermineWebSiteTemplateID(business);
            if (business.webSiteTemplateID != newTemplateID)
            {
                business.webSiteTemplateID = newTemplateID;
            }

            await _context.SaveChangesAsync();

            return Ok("Business details updated successfully.");
        }

        /// <summary>
        /// Deletes an appointment belonging to a specific business.
        /// </summary>
        /// <param name="businessId">The ID of the business</param>
        /// <param name="appointmentId">The ID of the appointment</param>
        /// <returns>Success or failure message</returns>
        [HttpDelete("{businessId}/appointments/{appointmentId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteAppointment(int businessId, int appointmentId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentID == appointmentId && a.BusinessID == businessId);

            if (appointment == null)
            {
                return NotFound("Appointment not found for this business.");
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Updates the status of an appointment to 'Accepted'.
        /// </summary>
        /// <param name="businessId">The ID of the business</param>
        /// <param name="appointmentId">The ID of the appointment</param>
        /// <returns>Success or failure message</returns>
        [HttpPut("{businessId}/appointments/{appointmentId}/accept")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AcceptAppointment(int businessId, int appointmentId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentID == appointmentId && a.BusinessID == businessId);

            if (appointment == null)
            {
                return NotFound("Appointment not found for this business.");
            }

            if (appointment.Status != "Pending")
            {
                return BadRequest("Only pending appointments can be accepted.");
            }

            appointment.Status = "Accepted";
            await _context.SaveChangesAsync();

            return Ok("Appointment status updated to 'Accepted'.");
        }

        /// <summary>
        /// Deletes a business by ID.
        /// </summary>
        /// <param name="id">The ID of the business</param>
        /// <returns>No content</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteBusiness(int id)
        {
            var business = await _context.Businesses.FindAsync(id);

            if (business == null)
            {
                return NotFound("Business not found.");
            }

            _context.Businesses.Remove(business);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Deletes a business by email.
        /// </summary>
        /// <param name="email">The email of the business</param>
        /// <returns>No content</returns>
        [HttpDelete("email/{email}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteBusinessByEmail(string email)
        {
            var business = await _context.Businesses.FirstOrDefaultAsync(b => b.Email == email);

            if (business == null)
            {
                return NotFound("Business not found.");
            }

            _context.Businesses.Remove(business);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private int DetermineWebSiteTemplateID(Business business)
        {
            int templateID = 1;

            if (business.hasMessaging && business.hasStatistics && business.hasMenuPrices && business.hasDirections)
                templateID = 16;
            else if (business.hasMessaging && business.hasStatistics && business.hasDirections)
                templateID = 15;
            else if (business.hasMessaging && business.hasStatistics && business.hasMenuPrices)
                templateID = 14;
            else if (business.hasMessaging && business.hasMenuPrices && business.hasDirections)
                templateID = 13;
            else if (business.hasStatistics && business.hasMenuPrices && business.hasDirections)
                templateID = 12;
            else if (business.hasMessaging && business.hasStatistics)
                templateID = 11;
            else if (business.hasMessaging && business.hasMenuPrices)
                templateID = 10;
            else if (business.hasMessaging && business.hasDirections)
                templateID = 9;
            else if (business.hasStatistics && business.hasMenuPrices)
                templateID = 8;
            else if (business.hasStatistics && business.hasDirections)
                templateID = 7;
            else if (business.hasMenuPrices && business.hasDirections)
                templateID = 6;
            else if (business.hasMessaging)
                templateID = 5;
            else if (business.hasStatistics)
                templateID = 4;
            else if (business.hasMenuPrices)
                templateID = 3;
            else if (business.hasDirections)
                templateID = 2;

            return templateID;
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
