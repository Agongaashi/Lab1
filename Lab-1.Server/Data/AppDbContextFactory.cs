using Lab_1.Server.Data;  // Ky është namespace ku supozohet është AppDbContext
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Lab_1.Server.Data  // Ndrysho namespace sipas strukturës së folderit tënd
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseMySql(
                configuration.GetConnectionString("DefaultConnection"),
                new MySqlServerVersion(new Version(8, 0, 42))
            );

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
