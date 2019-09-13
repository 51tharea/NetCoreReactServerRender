const {createServerRenderer} = require('aspnet-prerendering');

module.exports = createServerRenderer(params => {
    return new Promise((resolve, reject) => {
        const result = `
            <h1>Hello from JS</h1>
            <p>Current time in Node is: ${new Date()}</p>
            <p>Request path is: ${params.location.path}</p>
            <p>Absolute URL is: ${params.absoluteUrl}</p>
        `;
        resolve({html: result})
    });
});