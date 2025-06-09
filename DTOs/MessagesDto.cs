using System.ComponentModel.DataAnnotations;

namespace Nokta_API.DTOs
{
    public class MessageCreateDto
    {
        [Required]
        public int UserID { get; set; }

        [Required]
        public int BusinessID { get; set; }

        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string Content { get; set; } = string.Empty;
    }

    public class MessageUpdateDto
    {
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string Content { get; set; } = string.Empty;
    }

    public class MessageResponseDto
    {
        public int MessageID { get; set; }
        public int UserID { get; set; }
        public int BusinessID { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        
        // User details
        public string UserName { get; set; } = string.Empty;
        
        // Business details
        public string BusinessName { get; set; } = string.Empty;
    }

    public class ConversationDto
    {
        public int UserID { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int BusinessID { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public List<MessageResponseDto> Messages { get; set; } = new List<MessageResponseDto>();
        public DateTime LastMessageDate { get; set; }
    }
} 