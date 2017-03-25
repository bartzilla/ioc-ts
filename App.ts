import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import {TenantRouter} from "./server/src/routes/TenantRouter";
import {TenantService} from "./server/src/services/tenant/TenantService";
import container from "./server/src/config/inversify.config";
import SERVICE_TYPES from "./server/src/services/types/service-types";

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;
    private tenantRouter: TenantRouter;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.injectDependencies();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    // Configure API endpoints.
    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        let router = express.Router();
        // placeholder route handler
        this.express.use('/', router);
        this.express.use('/v1/tenants', this.tenantRouter.getRouter());
    }

    private injectDependencies(): void {
        let tenantService = container.get<TenantService>(SERVICE_TYPES.TenantService);
        this.tenantRouter = new TenantRouter(tenantService);
    }

}

export default new App().express;