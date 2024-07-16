using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Customers;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<EntityType, ResultType> : List<ResultType>
    {
        public PagedList(IEnumerable<ResultType> items, int count, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<EntityType, ResultType>> CreateAsync(IQueryable<EntityType> source, IMapper mapper, PagingParams pageParams)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageParams.PageNumber - 1) * pageParams.PageSize).Take(pageParams.PageSize).ToListAsync();
            var resultItems = items.Select(it => mapper.Map<ResultType>(it)).ToList();
            return new PagedList<EntityType, ResultType>(resultItems, count, pageParams.PageNumber, pageParams.PageSize);
        }
    }
}
