using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
	public interface IChangeTrackingCreate
	{
		public DateTime CreatedDate { get; set; }
		public string CreatedBy { get; set; }
	}
	public interface IChangeTrackingUpdate
	{
		public DateTime? UpdatedDate { get; set; }
		public string UpdatedBy { get; set; }
	}
	public interface IChangeTrackingDelete
	{
		public DateTime? DeletedDate { get; set; }
		public string DeletedBy { get; set; }
		public bool IsDeleted { get; set; }
	}
}
