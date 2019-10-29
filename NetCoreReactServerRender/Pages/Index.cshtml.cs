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
        [BindProperty] public Global Global { get; set; }
        private ServiceUser ServiceUser { get; set; }
        private BrowserClient BrowserClient { get; set; }


        public void OnGet()
        {
            Global = new Global
            {
                PrivateSession = new PrivateSession
                {
                    Cookie = string.Join(", ", Request.Cookies.Select(x => $"{x.Key}={x.Value};"))
                },
                PublicSession = new PublicSession
                {
                    ServiceUser = ServiceUser
                },

                BrowserClient = BrowserClient
            };
        }

        public override void OnPageHandlerExecuting(PageHandlerExecutingContext context)
        {
            context.HttpContext.Items.TryGetValue("ServiceUser", out var serviceUser);
            context.HttpContext.Items.TryGetValue("Lang", out var userLang);
            ServiceUser = serviceUser as ServiceUser;
            BrowserClient = new BrowserClient
            {
                Language = userLang as string
            };

            base.OnPageHandlerExecuting(context);
        }
    }
}