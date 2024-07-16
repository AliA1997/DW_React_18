using Api.DTOs;
using API.Controllers;
using API.Services;
using Application.Core;
using Application.Customers;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Domain.User;
using Infrastructure.Email;
using Infrastructure.Photos;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Persistence;
using System.Text;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace API.test
{
    public class CustomerControllerTests
    {
        private readonly CustomerController _controller;
        private readonly IConfiguration _config;
        private readonly AppDbContext _dbContext;

        public CustomerControllerTests()
        {

            var mockMediator = new Mock<IMediator>();

            _config = BuildConfiguration();

            // Mocking the AppDbContext
            var (dbContext, _) = ConnectionUtils.MakeNewInMemorySqliteHalDatabase();
            _dbContext = dbContext;

            SeedCustomers();

            var services = new ServiceCollection();
            services.AddHttpClient();
            services.AddSingleton<AppDbContext>(_dbContext);
            services.AddMediatR(typeof(ReadCustomer.Handler).Assembly);
            services.AddMediatR(typeof(AddCustomer.Handler).Assembly);
            services.AddMediatR(typeof(UpdateCustomer.Handler).Assembly);
            services.AddMediatR(typeof(DeleteCustomer.Handler).Assembly);

            services.AddAutoMapper(typeof(MappingCustomerProfiles).Assembly);
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.Configure<CloudinarySettings>(_config.GetSection("Cloudinary"));
            services.AddSingleton<CustomerController>();

            var provider = services.BuildServiceProvider();
            _controller = provider.GetRequiredService<CustomerController>();

        }


        [Fact]
        public async Task CreateCustomer_BasedOnDto_ENG001()
        {
            var TEST_EMAIL = "devmtnali@gmail.com";
            CreateCustomerDto createCustomerDto = new CreateCustomerDto
            {
                FirstName = "Ali",
                LastName = "Alhaddad",
                Email = TEST_EMAIL,
                PhoneNumber = "8135519681",
                Birthdate = new DateTime(1990, 9, 7),
                FavoriteColor = "#7b785c",
                Photo = "https://res.cloudinary.com/aa1997/image/upload/v1720395961/wnkqgghtwazbihenvrpl.png"
            };

            try
            {
                var createdCustomerResponse = await _controller.CreateCustomer(createCustomerDto);
                if (createdCustomerResponse.Result is OkObjectResult okObjectResult)
                {
                    var customer = okObjectResult.Value as Customer;
                    // Assert that the user is present in the database
                    // You may need to add additional logic to verify this
                    Assert.NotNull(customer);
                    Assert.NotNull(customer.Id);
                    Assert.Equal(customer.Email, createCustomerDto.Email);
                }
                else
                {
                    Assert.Fail("MediaR says the creation of customer details not successful.");
                }
            }
            catch {
                Assert.Fail("Did not successfully create customer");
            }
        }

        [Fact]
        public async Task ReadCustomers_BasedOnDto_ENG002()
        {
            var pagingParams = new PagingParams()
            {
                PageNumber = 1,
                PageSize = 20
            };

            try
            {

                var result = await _controller.ReadCustomerDetails(pagingParams);

                Assert.NotNull(result);
            } catch
            {
                throw new Exception("Can't read customer details");
            }
        }

        [Fact]
        public async Task UpdateCustomer_BasedOnDto_ENG003()
        {
            var customerToUpdate = await _dbContext.Customers.FirstOrDefaultAsync();
            var testFirstName = "Ali - Updated";
            var testColor = "#42a1813c";
            UpdateCustomerDto updateCustomerDto = new UpdateCustomerDto
            {
                FirstName = testFirstName,
                FavoriteColor = testColor,
            };

            try
            {
                await _controller.UpdateCustomer(customerToUpdate.Id.ToString(), updateCustomerDto);
                var readCustomerResponse = await _controller.ReadCustomerDetailsById(customerToUpdate.Id.ToString());
                // Assert that the user is present in the database
                // You may need to add additional logic to verify this
                if(readCustomerResponse.Result is OkObjectResult okObjectResult)
                {
                    var customerDetails = okObjectResult.Value as CustomerDetails;
                    Assert.NotNull(okObjectResult.Value);
                    Assert.Equal(customerDetails.FirstName, testFirstName);
                } else
                {
                    Assert.Fail("MediaR says the updating of customer details not successful.");
                }
            }
            catch
             
            {
                Assert.Fail("Did not successfully update customer");
            }
        }

        [Fact]
        public async Task DeleteCustomer_BasedOnDto_ENG004()
        {
            var customerToDelete = await _dbContext.Customers.FirstOrDefaultAsync();

            try
            {
                var customerDeleteResponse = await _controller.DeleteCustomer(customerToDelete!.Id.ToString());

                Assert.IsType<NoContentResult>(customerDeleteResponse);;
            }
            catch
            {
                Assert.Fail("Did not successfully delete customer");
            }
        }

        private async Task<IFormFile> CreateMockFile()
        {
            // Initialize HttpClient
            using var httpClient = new HttpClient();

            // Download image data from the URL
            byte[] imageBytes = await httpClient.GetByteArrayAsync("https://res.cloudinary.com/aa1997/image/upload/v1720395961/wnkqgghtwazbihenvrpl.png");

            // Create a memory stream from the downloaded data
            var ms = new MemoryStream(imageBytes);

            // Extract file name from URL
            string fileName = Path.GetFileName("https://res.cloudinary.com/aa1997/image/upload/v1720395961/wnkqgghtwazbihenvrpl.png");

            // Create an instance of FormFile
            var formFile = new FormFile(ms, 0, ms.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg" // Adjust the content type based on your image
            };

            return formFile;
        }

        private IConfiguration BuildConfiguration()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables();

            return builder.Build();
        }

        private void SeedCustomers()
        {
            var testCustomers = new List<Customer>()
            {
                new Customer()
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Bob",
                    LastName = "Johnson",
                    Email = "bob@gmail.com",
                    PhoneNumber = "991556800",
                    BirthDate = new DateTime(1960, 10, 7),
                    FavoriteColor = "Red",
                    Avatar = ""
                },
                                new Customer()
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Jane",
                    LastName = "Doe",
                    Email = "jane@gmail.com",
                    PhoneNumber = "981556800",
                    BirthDate = new DateTime(1980, 10, 7),
                    FavoriteColor = "Red",
                    Avatar = ""
                },
            };
            _dbContext.Customers.AddRange(testCustomers);
            _dbContext.SaveChanges();
        }
    }
}