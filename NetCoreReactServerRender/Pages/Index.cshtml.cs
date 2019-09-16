using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NetCoreReactServerRender.Models;

namespace NetCoreReactServerRender.Pages
{
    public class Index : PageModel
    {
        [BindProperty] public NodeSession NodeSession { get; set; }
        [BindProperty] public ServiceUser ServiceUser { get; set; }

        public void OnGet()
        {
            NodeSession = new NodeSession
            {
                Private = new PrivateSession
                {
                    Cookie = string.Join(", ", Request.Cookies.Select(x => $"{x.Key}={x.Value};"))
                },
                Public = new PublicSession
                {
                    ServiceUser = ServiceUser
                }
            };
        }

        public override void OnPageHandlerExecuting(PageHandlerExecutingContext context)
        {
            context.HttpContext.Items.TryGetValue("ServiceUser", out var serviceUser);
            ServiceUser = serviceUser as ServiceUser;

            base.OnPageHandlerExecuting(context);
        }
    }
}