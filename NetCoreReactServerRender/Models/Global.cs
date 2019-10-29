namespace NetCoreReactServerRender.Models
{
    public class Global
    {
        public PublicSession PublicSession { get; set; }

        /// <summary>
        /// Contains private session that can be used only by NodeServices.
        /// </summary>
        public PrivateSession PrivateSession { get; set; }

        public BrowserClient BrowserClient { get; set; }
    }
}