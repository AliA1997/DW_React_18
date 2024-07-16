using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Customers
{
    public class DeleteCustomer
    {
        public class Command : IRequest<Result<Customer>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Customer>>
        {
            private readonly AppDbContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(AppDbContext context, IPhotoAccessor photoAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
            }

            public async Task<Result<Customer>> Handle(Command request, CancellationToken cancellationToken)
            {
                var guidId = new Guid(request.Id);
                var customerToRemove = await _context.Customers
                    //.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.Id == guidId);

                if (customerToRemove == null) return Result<Customer>.Failure("Customer cannot be deleted.");

                _context.Customers.Remove(customerToRemove);

				var success = await _context.SaveChangesAsync() > 0;

				if (success) return Result<Customer>.Success(new Customer());

                return Result<Customer>.Failure("Problem deleting customer from API");
            }
        }
    }
}