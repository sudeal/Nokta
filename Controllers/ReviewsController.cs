using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nokta_API;

namespace Nokta_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all reviews.
        /// </summary>
        /// <returns>List of reviews</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviews()
        {
            try
            {
                var reviews = await _context.Reviews
                    .Select(r => new ReviewDto
                    {
                        UserID = r.UserID,
                        BusinessID = r.BusinessID,
                        Rating = r.Rating,
                        Comment = r.Comment,
                        CreatedAt = r.CreatedAt
                    })
                    .ToListAsync();

                if (!reviews.Any())
                {
                    return NotFound("No reviews found.");
                }

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Retrieves all reviews for a specific business by BusinessID with simplified response.
        /// </summary>
        /// <param name="businessId">The ID of the business</param>
        /// <returns>List of simplified reviews for the specified business</returns>
        [HttpGet("business/{businessId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsByBusinessId(int businessId)
        {
            try
            {
                var reviews = await _context.Reviews
                    .Where(r => r.BusinessID == businessId)
                    .Select(r => new ReviewDto
                    {
                        UserID = r.UserID,
                        BusinessID = r.BusinessID,
                        Rating = r.Rating,
                        Comment = r.Comment,
                        CreatedAt = r.CreatedAt
                    })
                    .ToListAsync();

                if (!reviews.Any())
                {
                    return NotFound($"No reviews found for BusinessID {businessId}.");
                }

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Posts a new review.
        /// </summary>
        /// <param name="reviewDto">The review data transfer object</param>
        /// <returns>The created review</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Review>> PostReview([FromBody] ReviewDto reviewDto)
        {
            if (reviewDto == null || reviewDto.Rating < 1 || reviewDto.Rating > 5)
            {
                return BadRequest("Invalid review. Ensure rating is between 1 and 5.");
            }

            var userExists = await _context.Users.AnyAsync(u => u.UserID == reviewDto.UserID);
            if (!userExists)
            {
                return BadRequest("Invalid UserID.");
            }

            var businessExists = await _context.Businesses.AnyAsync(b => b.BusinessID == reviewDto.BusinessID);
            if (!businessExists)
            {
                return BadRequest("Invalid BusinessID.");
            }

            var review = new Review
            {
                UserID = reviewDto.UserID,
                BusinessID = reviewDto.BusinessID,
                Rating = (float)reviewDto.Rating,
                Comment = reviewDto.Comment ?? string.Empty,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReviews), new { id = review.ReviewID }, review);
        }

        /// <summary>
        /// Deletes a review by ID.
        /// </summary>
        /// <param name="id">The ID of the review</param>
        /// <returns>No content</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);

            if (review == null)
            {
                return NotFound("Review not found.");
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    /// <summary>
    /// Data Transfer Object for review submission and retrieval.
    /// </summary>
    public class ReviewDto
    {
        public int UserID { get; set; }
        public int BusinessID { get; set; }
        public float Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; } // Added field for comment date
    }
}
