using System;
using Application.Customers;
using Application.Profiles;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Infrastructure.Email;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;
using Domain;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration config)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            services.AddDbContext<AppDbContext>(options =>
            {

	            //string connStr;

	            // Depending on if in development or production, use either Heroku-provided
	            // connection string, or development connection string from env var.

	            //if (env == "Development")
	            //{
	            // Use connection string from file.
	            //connStr = config.GetConnectionString("DefaultConnection");
	            //options.UseSqlite(config.GetConnectionString("DefaultConnection"));
	        
	            //}
	            // else
	            // {
	            //     // Use connection string provided at runtime by Heroku.
	            //     var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

	            //     // Parse connection URL to connection string for Npgsql
	            //     connUrl = connUrl.Replace("postgres://", string.Empty);
	            //     var pgUserPass = connUrl.Split("@")[0];
	            //     var pgHostPortDb = connUrl.Split("@")[1];
	            //     var pgHostPort = pgHostPortDb.Split("/")[0];
	            //     var pgDb = pgHostPortDb.Split("/")[1];
	            //     var pgUser = pgUserPass.Split(":")[0];
	            //     var pgPass = pgUserPass.Split(":")[1];
	            //     var pgHost = pgHostPort.Split(":")[0];
	            //     var pgPort = pgHostPort.Split(":")[1];

	            //     connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb}; SSL Mode=Require; Trust Server Certificate=true";
	            // }

	            // Whether the connection string came from the local development configuration file
	            // or from the environment variable from Heroku, use it to set up your DbContext.
	            options.UseNpgsql(config.GetConnectionString("Postgres"), b => b.MigrationsAssembly("Persistence"));
            });

services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithExposedHeaders("WWW-Authenticate", "Pagination")
                        .WithOrigins("http://localhost:3000");
                });
            });
            services.AddMediatR(typeof(ReadCustomer.Handler).Assembly);
            services.AddMediatR(typeof(AddCustomer.Handler).Assembly);
            services.AddMediatR(typeof(UpdateCustomer.Handler).Assembly);
            services.AddMediatR(typeof(DeleteCustomer.Handler).Assembly);
            services.AddMediatR(typeof(Details.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddAutoMapper(typeof(MappingCustomerProfiles).Assembly);
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.AddScoped<EmailSender>();
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            services.AddSignalR();

            return services;
        }
    }
}