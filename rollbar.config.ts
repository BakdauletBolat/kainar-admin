// rollbar.config.js
export default {
    accessToken: '9ef947d033b24aa58776acae00019cea',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: 'dev',
        client: {
            javascript: {
                code_version: '1.0.0',
            },
        },
    },
};