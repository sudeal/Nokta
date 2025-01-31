using Microsoft.EntityFrameworkCore;

namespace Nokta_API
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSets representing database tables
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Business> Businesses { get; set; } = null!;
        public DbSet<Appointment> Appointments { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Users configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserID);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PhoneNumber).HasMaxLength(15);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Age);
                entity.Property(e => e.Location).HasMaxLength(255);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Businesses configuration
            modelBuilder.Entity<Business>(entity =>
            {
                entity.HasKey(e => e.BusinessID);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.OwnerName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Address).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.ContactNumber).IsRequired().HasMaxLength(15);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.hasMessaging).HasDefaultValue(false);
                entity.Property(e => e.hasStatistics).HasDefaultValue(false);
                entity.Property(e => e.hasMenuPrices).HasDefaultValue(false);
                entity.Property(e => e.hasDirections).HasDefaultValue(false);
                entity.Property(e => e.OpeningHour).IsRequired();
                entity.Property(e => e.ClosingHour).IsRequired();
                entity.HasCheckConstraint("CK_Businesses_Category", "Category IN ('Health Care', 'Personal Care', 'Food & Beverage')");
                entity.HasCheckConstraint("CK_Businesses_OpeningHour", "OpeningHour BETWEEN 0 AND 24");
                entity.HasCheckConstraint("CK_Businesses_ClosingHour", "ClosingHour BETWEEN 0 AND 24");
            });

            // Appointments configuration
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasKey(e => e.AppointmentID);
                entity.Property(e => e.AppointmentDateTime).IsRequired();
                entity.Property(e => e.Note).HasDefaultValue("No note added.");
                entity.Property(e => e.Status).HasDefaultValue("Pending").HasMaxLength(50);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserID)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Business)
                      .WithMany()
                      .HasForeignKey(e => e.BusinessID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Reviews configuration
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.ReviewID);
                entity.Property(e => e.Rating).IsRequired().HasColumnType("float");
                entity.Property(e => e.Comment).HasDefaultValue(string.Empty);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserID)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Business)
                      .WithMany()
                      .HasForeignKey(e => e.BusinessID)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasCheckConstraint("CK_Reviews_Rating", "Rating BETWEEN 1 AND 5");
            });
        }
    }

    // Entities
    public class User
    {
        public int UserID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int? Age { get; set; }
        public string Location { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class Business
    {
        public int BusinessID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool hasMessaging { get; set; }
        public bool hasStatistics { get; set; }
        public bool hasMenuPrices { get; set; }
        public bool hasDirections { get; set; }
        public int? webSiteTemplateID { get; set; }
        public double OpeningHour { get; set; }
        public double ClosingHour { get; set; }
    }

    public class Appointment
    {
        public int AppointmentID { get; set; }
        public int UserID { get; set; }
        public int BusinessID { get; set; }
        public DateTime AppointmentDateTime { get; set; }
        public string Note { get; set; } = "No note added.";
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; }
        public User? User { get; set; }
        public Business? Business { get; set; }
    }

    public class Review
    {
        public int ReviewID { get; set; }
        public int UserID { get; set; }
        public int BusinessID { get; set; }
        public float Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public User User { get; set; } = null!;
        public Business Business { get; set; } = null!;
    }
}
