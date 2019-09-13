using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace NetCoreReactServerRender
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc()
                .AddRazorPagesOptions(options => { options.Conventions.AddPageRoute("/index", "{*url}"); })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddSpaPrerenderer();
            services.AddNodeServices();
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc();
        }
    }


//    public class Startup
//    {
//        private readonly IHostingEnvironment Environment;
//
//        public Startup(IConfiguration configuration,IHostingEnvironment environment)
//        {
//            Environment = environment;
//            Configuration = configuration;
//        }
//
//        public IConfiguration Configuration { get; }
//
//        // This method gets called by the runtime. Use this method to add services to the container.
//        public void ConfigureServices(IServiceCollection services)
//        {
//            services.Configure<CookiePolicyOptions>(options =>
//            {
//                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
//                options.CheckConsentNeeded = context => true;
//                options.MinimumSameSitePolicy = SameSiteMode.None;
//            });
//
//            services.AddSpaPrerenderer();
//
//            services.AddNodeServices();
//
//            services.AddMvc()
//                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
//                .AddRazorPagesOptions(options => { options.Conventions.AddPageRoute("/index", "{*url}"); });
//        }
//
//        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
//        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
//        {
//            if (env.IsDevelopment())
//            {
//                app.UseDeveloperExceptionPage();
//            }
//            else
//            {
//                app.UseExceptionHandler("/Home/Error");
//                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
//                app.UseHsts();
//            }
//            var ProjectPath = Path.GetFullPath(@"..\ClientApp", Environment.WebRootPath);
//            app.UseWebpackDevMiddleware();
////            app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
////            {
////                ProjectPath = ProjectPath,
////                HotModuleReplacement = true,
////                ReactHotModuleReplacement = true,
////            });
//            
//            app.UseHttpsRedirection();
//            app.UseStaticFiles();
//            app.UseCookiePolicy();
//            app.UseMvc();
//
////            app.UseMvc(routes =>
////            {
////                routes.MapRoute(
////                    name: "default",
////                    template: "{controller=Home}/{action=Index}/{id?}");
////
////                routes.MapSpaFallbackRoute(
////                    name: "spa-fallback",
////                    defaults: new {controller = "Home", action = "Index"});
////            });
//        }
//    }
}