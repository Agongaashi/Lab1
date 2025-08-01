using Lab_1.Server.Models;
using Lab_1.Server.Models.Admin;
using Microsoft.EntityFrameworkCore;

namespace Lab_1.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();


        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    base.OnModelCreating(modelBuilder);

        //    modelBuilder.Entity<User>()
        //        .HasOne(u => u.Role)
        //        .WithMany()
        //        .HasForeignKey(u => u.RoleName)
        //        .HasPrincipalKey(r => r.RoleName);
        //}

    }
}
