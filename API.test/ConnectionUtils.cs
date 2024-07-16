using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.test
{
    public class ConnectionUtils
    {
        public static (AppDbContext, SqliteConnection) MakeNewInMemorySqliteHalDatabase()
        {
            var connection = new SqliteConnection($"Filename=:memory:");
            connection.Open();

            var dwContext = GetSqlLiteHalConnection(connection);

            dwContext.Database.EnsureDeleted();
            dwContext.Database.EnsureCreated();

            return (dwContext, connection);
        }

        public static AppDbContext GetSqlLiteHalConnection(SqliteConnection openConnection)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite(openConnection)
                .Options;

            return new AppDbContext(options);
        }
    }
}
