using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nokta_API;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Nokta_API.Controllers 
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // GET: api/Users/email/{email}
        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        /// <summary>
        /// Register a new user.
        /// </summary>
        /// <param name="user">The user to register</param>
        /// <returns>The registered user</returns>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<User>> Register([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("User cannot be null.");
            }

            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                return BadRequest("Password cannot be null or empty.");
            }

            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return Conflict("A user with this email already exists.");
            }

            using var sha256 = SHA256.Create();
            var hashedPassword = sha256.ComputeHash(Encoding.UTF8.GetBytes(user.PasswordHash));
            user.PasswordHash = Convert.ToBase64String(hashedPassword);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.UserID }, user);
        }

        /// <summary>
        /// Login for a user.
        /// </summary>
        /// <param name="loginRequest">Dynamic login request containing email and password</param>
        /// <returns>Success or failure message</returns>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> Login([FromBody] JsonElement loginRequest)
        {
            try
            {
                if (!loginRequest.TryGetProperty("email", out JsonElement emailElement) ||
                    !loginRequest.TryGetProperty("password", out JsonElement passwordElement))
                {
                    return BadRequest("Invalid login request. 'email' and 'password' fields are required.");
                }

                string email = emailElement.GetString() ?? string.Empty;
                string password = passwordElement.GetString() ?? string.Empty;

                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                {
                    return BadRequest("Email and password cannot be empty.");
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user == null)
                {
                    return Unauthorized("Invalid email or password.");
                }

                using var sha256 = SHA256.Create();
                var hashedPassword = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var hashedPasswordString = Convert.ToBase64String(hashedPassword);

                if (user.PasswordHash != hashedPasswordString)
                {
                    return Unauthorized("Invalid email or password.");
                }

                return Ok("Login successful.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Users/email/{email}
        [HttpDelete("email/{email}")]
        public async Task<IActionResult> DeleteUserByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserID == id);
        }
    }
}
