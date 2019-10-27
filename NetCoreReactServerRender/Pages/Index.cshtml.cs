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
        [BindProperty] public BrowserClient BrowserClient { get; set; }
        [BindProperty] public string UserLang { get; set; }

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
                },
                
                BrowserClient = new BrowserClient
                {
                    Language = UserLang
                }
            };
        }

        public override void OnPageHandlerExecuting(PageHandlerExecutingContext context)
        {
            context.HttpContext.Items.TryGetValue("ServiceUser", out var serviceUser);
            context.HttpContext.Items.TryGetValue("Lang", out var userLang);
            ServiceUser = serviceUser as ServiceUser;
            UserLang = userLang as string;

            base.OnPageHandlerExecuting(context);
        }
    }
}