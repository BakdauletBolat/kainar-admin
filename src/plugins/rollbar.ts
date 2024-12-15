import Rollbar from 'rollbar';
import config from '../../rollbar.config';

const rollbar = new Rollbar(config);

export default {
    install(app: any) {
        app.config.errorHandler = (error: any, vm: any, info: any) => {
            rollbar.error(error, { vueComponent: vm, info });
            if (app.config.devtools) {
                console.error(error);
            }
        };
        app.provide('rollbar', rollbar);
    },
};