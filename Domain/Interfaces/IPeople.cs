using System.Collections.Generic;
using Domain.User;

namespace Domain.Interfaces
{
	public interface IPeople
	{
		string Title { get; set; }
		string FirstName { get; set; }
		string LastName { get; set; }

	}
}