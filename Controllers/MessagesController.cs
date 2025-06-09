using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nokta_API;
using Nokta_API.DTOs;

namespace Nokta_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessagesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all messages for a specific business.
        /// </summary>
        /// <param name="businessId">The ID of the business</param>
        /// <returns>List of messages</returns>
        [HttpGet("business/{businessId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<MessageResponseDto>>> GetBusinessMessages(int businessId)
        {
            var messages = await _context.Messages
                .Where(m => m.BusinessID == businessId)
                .Include(m => m.User)
                .Include(m => m.Business)
                .OrderByDescending(m => m.Date)
                .Select(m => new MessageResponseDto
                {
                    MessageID = m.MessageID,
                    UserID = m.UserID,
                    BusinessID = m.BusinessID,
                    Content = m.Content,
                    Date = m.Date,
                    UserName = m.User.Name,
                    BusinessName = m.Business.Name
                })
                .ToListAsync();

            if (!messages.Any())
            {
                return NotFound("No messages found for this business.");
            }

            return Ok(messages);
        }

        /// <summary>
        /// Retrieves all messages for a specific user.
        /// </summary>
        /// <param name="userId">The ID of the user</param>
        /// <returns>List of messages</returns>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<MessageResponseDto>>> GetUserMessages(int userId)
        {
            var messages = await _context.Messages
                .Where(m => m.UserID == userId)
                .Include(m => m.User)
                .Include(m => m.Business)
                .OrderByDescending(m => m.Date)
                .Select(m => new MessageResponseDto
                {
                    MessageID = m.MessageID,
                    UserID = m.UserID,
                    BusinessID = m.BusinessID,
                    Content = m.Content,
                    Date = m.Date,
                    UserName = m.User.Name,
                    BusinessName = m.Business.Name
                })
                .ToListAsync();

            if (!messages.Any())
            {
                return NotFound("No messages found for this user.");
            }

            return Ok(messages);
        }

        /// <summary>
        /// Retrieves conversation between a specific user and business.
        /// </summary>
        /// <param name="userId">The ID of the user</param>
        /// <param name="businessId">The ID of the business</param>
        /// <returns>Conversation with messages</returns>
        [HttpGet("conversation/{userId}/{businessId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ConversationDto>> GetConversation(int userId, int businessId)
        {
            var messages = await _context.Messages
                .Where(m => m.UserID == userId && m.BusinessID == businessId)
                .Include(m => m.User)
                .Include(m => m.Business)
                .OrderByDescending(m => m.Date)
                .Select(m => new MessageResponseDto
                {
                    MessageID = m.MessageID,
                    UserID = m.UserID,
                    BusinessID = m.BusinessID,
                    Content = m.Content,
                    Date = m.Date,
                    UserName = m.User.Name,
                    BusinessName = m.Business.Name
                })
                .ToListAsync();

            if (!messages.Any())
            {
                return NotFound("No conversation found between this user and business.");
            }

            var conversation = new ConversationDto
            {
                UserID = userId,
                UserName = messages.First().UserName,
                BusinessID = businessId,
                BusinessName = messages.First().BusinessName,
                Messages = messages,
                LastMessageDate = messages.First().Date
            };

            return Ok(conversation);
        }

        /// <summary>
        /// Sends a new message.
        /// </summary>
        /// <param name="messageDto">The message to send</param>
        /// <returns>The sent message</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<MessageResponseDto>> SendMessage([FromBody] MessageCreateDto messageDto)
        {
            if (messageDto == null)
            {
                return BadRequest("Message cannot be null.");
            }

            // Verify that both user and business exist
            var user = await _context.Users.FindAsync(messageDto.UserID);
            var business = await _context.Businesses.FindAsync(messageDto.BusinessID);

            if (user == null)
            {
                return BadRequest("User not found.");
            }

            if (business == null)
            {
                return BadRequest("Business not found.");
            }

            // Check if the business has messaging enabled
            if (!business.hasMessaging)
            {
                return BadRequest("This business does not have messaging enabled.");
            }

            var message = new Message
            {
                UserID = messageDto.UserID,
                BusinessID = messageDto.BusinessID,
                Content = messageDto.Content,
                Date = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            var responseDto = new MessageResponseDto
            {
                MessageID = message.MessageID,
                UserID = message.UserID,
                BusinessID = message.BusinessID,
                Content = message.Content,
                Date = message.Date,
                UserName = user.Name,
                BusinessName = business.Name
            };

            return CreatedAtAction(nameof(GetConversation), 
                new { userId = message.UserID, businessId = message.BusinessID }, 
                responseDto);
        }

        /// <summary>
        /// Updates a message's content.
        /// </summary>
        /// <param name="messageId">The ID of the message to update</param>
        /// <param name="updateDto">The updated message content</param>
        /// <returns>Success or failure status</returns>
        [HttpPut("{messageId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateMessage(int messageId, [FromBody] MessageUpdateDto updateDto)
        {
            var message = await _context.Messages.FindAsync(messageId);

            if (message == null)
            {
                return NotFound("Message not found.");
            }

            message.Content = updateDto.Content;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Messages.AnyAsync(m => m.MessageID == messageId))
                {
                    return NotFound("Message not found.");
                }
                throw;
            }

            return Ok("Message updated successfully.");
        }

        /// <summary>
        /// Deletes a specific message.
        /// </summary>
        /// <param name="messageId">The ID of the message to delete</param>
        /// <returns>Success or failure status</returns>
        [HttpDelete("{messageId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteMessage(int messageId)
        {
            var message = await _context.Messages.FindAsync(messageId);

            if (message == null)
            {
                return NotFound("Message not found.");
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 