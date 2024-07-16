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
using Google.Protobuf.WellKnownTypes;
using Infrastructure.Color;
using System.Net.Http;
using System.Text.Json;

namespace Application.Customers
{
    public class UpdateCustomer
    {
        public class Command : IRequest<Result<Customer>>
        {
            public string Id { get; set; }
            public string? FirstName { get; set; }
            public string? LastName { get; set; }
            public string? Email { get; set; }
            public string? PhoneNumber { get; set; }

            public DateTime? Birthdate { get; set; }
            public string? FavoriteColor { get; set; }
            public string? Photo { get; set; }
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

                Guid customerGuid = new Guid(request.Id);
                var customer = await _context.Customers
                            .FirstOrDefaultAsync(x => x.Id == customerGuid);

                if (customer == null) throw new Exception("Customer doesn't work");

                if (!string.IsNullOrWhiteSpace(request.FirstName))
                    customer.FirstName = request.FirstName;
                if(!string.IsNullOrWhiteSpace(request.LastName))
                    customer.LastName = request.LastName;
                if(!string.IsNullOrWhiteSpace(request.Email))
                    customer.Email = request.Email;
                if(!string.IsNullOrWhiteSpace(request.PhoneNumber))
                    customer.PhoneNumber = request.PhoneNumber;
                if (request.Birthdate != null)
                {
                    customer.BirthDate = DateTime.SpecifyKind((DateTime)request.Birthdate, DateTimeKind.Utc);
                    customer.Age = ((DateTime)request.Birthdate).GetAge();
                }
                if (!string.IsNullOrWhiteSpace(request.FavoriteColor))
                    customer.FavoriteColor = request.FavoriteColor;


                if (!string.IsNullOrWhiteSpace(request.Photo))
                {
                    customer.Avatar = request.Photo;
                }

                if (!string.IsNullOrEmpty(request.FavoriteColor))
                {
                    var response = await _httpClient.GetAsync($"https://api.color.pizza/v1/?values={request.FavoriteColor}&list=bestOf");

                    if (!response.IsSuccessStatusCode)
                        return null;

                    var content = await response.Content.ReadAsStringAsync();
                    var colorResult = JsonSerializer.Deserialize<ColorResponse>(content);
                    customer.FavoriteColor = colorResult.paletteTitle;
                }

                _context.Update(customer);
     
                var result = await _context.SaveChangesAsync() > 0;

                if (result) return Result<Customer>.Success(customer);

                return Result<Customer>.Failure("Problem adding customer");
            }
        }
    }
}