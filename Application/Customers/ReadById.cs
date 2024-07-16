using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Customers
{
    public class ReadCustomerById
    {
        public class Command : IRequest<Result<CustomerDetails>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<CustomerDetails>>
        {
            private readonly AppDbContext _context;
            private readonly IMapper _mapper;
            public Handler(AppDbContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<CustomerDetails>> Handle(Command request, CancellationToken cancellationToken)
            {
                var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == new Guid(request.Id));

                if (customer == null)
                    return Result<CustomerDetails>.Failure("Customer doesn't exist!");

                var customerDetails = _mapper.Map<CustomerDetails>(customer);

                return Result<CustomerDetails>.Success(customerDetails);
            }
        }
    }
}