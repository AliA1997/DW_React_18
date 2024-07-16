using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using System;

namespace Domain.User
{
    public class ApplicationAccessRole : IdentityRole<Guid>
    {
        public Guid ApplicationId { get; set; }
        public bool IsApplicationRole { get; set; } = false;
        public Application Application { get; set; }
        public ICollection<AspNetRolesClaim> ParentRoles { get; set; }
        public ICollection<AspNetRolesClaim> ChildRoles { get; set; }
    }
}