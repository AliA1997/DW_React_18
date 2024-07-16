using System.Linq;
using Application.Customers;
using Application.Profiles;
using Domain;

namespace Application.Core
{
    public class MappingCustomerProfiles : MappingProfiles
    {
        public MappingCustomerProfiles()
        {
            CreateMap<Customer, CustomerDetails>()
               .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.BirthDate.GetAge()))
               .ForMember(dest => dest.Birthday, opt => opt.MapFrom(src => src.BirthDate));
        }
    }
}