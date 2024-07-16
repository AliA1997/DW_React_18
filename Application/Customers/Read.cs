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
    public class ReadCustomer
    {
        public class Command : IRequest<Result<PagedList<Customer, CustomerDetails>>>
        {
            public PagingParams GetCustomerDetailsParams { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<PagedList<Customer, CustomerDetails>>>
        {
            private readonly AppDbContext _context;
            private readonly IMapper _mapper;
            public Handler(AppDbContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<PagedList<Customer, CustomerDetails>>> Handle(Command request, CancellationToken cancellationToken)
            {
                var pageParams = request.GetCustomerDetailsParams;
                var customersToQuery = _context.Customers.AsQueryable();

                var pagedCustomers = await PagedList<Customer, CustomerDetails>.CreateAsync(customersToQuery, _mapper, pageParams);

                return Result<PagedList<Customer, CustomerDetails>>.Success(pagedCustomers);
            }
        }
    }
}