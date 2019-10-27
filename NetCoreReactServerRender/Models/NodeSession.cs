namespace NetCoreReactServerRender.Models
{
    /// <summary>
    /// 
    /// </summary>
    public class NodeSession
    {
        /// <summary>
        /// Contains public session that you can share in the browser's window object.
        /// </summary>
        public PublicSession Public { get; set; }

        /// <summary>
        /// Contains private session that can be used only by NodeServices.
        /// </summary>
        public PrivateSession Private { get; set; }

        public BrowserClient BrowserClient { get; set; }
    }

    public class PublicSession
    {
        public ServiceUser ServiceUser { get; set; }
    }

    public class PrivateSession
    {
        public string Cookie { get; set; }
    }

    public class ServiceUser
    {
        public string Login { get; set; }
    }

    public class BrowserClient
    {
        public string Language { get; set; }
    }
}