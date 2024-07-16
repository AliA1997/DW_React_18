using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Domain.User
{
	public class AspNetRolesClaim
	{
		public Guid AspNetRoleId { get; set; }
		public ApplicationAccessRole ChildAspNetRole { get; set; }
		public Guid ParentAspNetRoleId { get; set; }
		public ApplicationAccessRole ParentAspNetRole { get; set; }
	}
}
