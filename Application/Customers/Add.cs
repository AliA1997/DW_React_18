using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Application.Photos;
using Persistence;
using System.Net.Http;
using System.Drawing;
using System.Text.Json;
using Infrastructure.Color;

namespace Application.Customers
{
    public class AddCustomer
    {
        public class Command : IRequest<Result<Customer>>
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; }
            public DateTime Birthdate { get; set; }
            public string FavoriteColor { get; set; }
            public string Photo { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Customer>>
        {
            private readonly AppDbContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly HttpClient _httpClient;
            public Handler(AppDbContext context, IPhotoAccessor photoAccessor, HttpClient httpClient)
            {
                _photoAccessor = photoAccessor;
                _context = context;
                _httpClient = httpClient;
            }

            public async Task<Result<Customer>> Handle(Command request, CancellationToken cancellationToken)
            {
                var customer = await _context.Customers
                            .FirstOrDefaultAsync(x => x.Email == request.Email);
                string? coolColorName = null;
                if (customer != null) throw new Exception("Customer already exists, can't add an existing customer.");


                if(!string.IsNullOrEmpty(request.FavoriteColor))
                {
                    var colorWithoutHashtag = request.FavoriteColor.Substring(1);
                    var response = await _httpClient.GetAsync($"https://api.color.pizza/v1/?values={colorWithoutHashtag}&list=bestOf");

                    if (!response.IsSuccessStatusCode)
                    {
                        coolColorName = "Black";

                    } else
                    {

                        var content = await response.Content.ReadAsStringAsync();
                        var colorResult = JsonSerializer.Deserialize<ColorResponse>(content);
                        coolColorName = colorResult.paletteTitle;
                    }
                }

                Customer newCustomer = new Customer
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    PhoneNumber = request.PhoneNumber,
                    Age = request.Birthdate.GetAge(),
                    BirthDate = request.Birthdate,
                    FavoriteColor = coolColorName != null ? coolColorName : "Black",
                    Avatar = !string.IsNullOrWhiteSpace(request.Photo) ? request.Photo : ""

                };

                _context.Customers.Add(newCustomer);

                var result = await _context.SaveChangesAsync() > 0;

                if (result) return Result<Customer>.Success(newCustomer);

                return Result<Customer>.Failure("Problem adding customer");
            }
        }
    }
}