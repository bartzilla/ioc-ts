import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import {TenantRouter} from "./server/src/routes/TenantRouter";
import {TenantService} from "./server/src/services/tenant/TenantService";
import container from "./server/src/config/inversify.config";
import SERVICE_TYPES from "./server/src/services/types/service-types";
import {ApplicationRouter} from "./server/src/routes/ApplicationRouter";
import {ApplicationService} from "./server/src/services/application/ApplicationService";

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;
    private tenantRouter: TenantRouter;
    private applicationRouter: ApplicationRouter;

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

        let router = express.Router();
        // placeholder route handler
        this.express.use('/', router);

        this.express.use('/v1/tenants', this.tenantRouter.getRouter());
        this.express.use('/v1/tenants', this.applicationRouter.getRouter());

    }

    private injectDependencies(): void {
        let tenantService = container.get<TenantService>(SERVICE_TYPES.TenantService);
        let applicationService = container.get<ApplicationService>(SERVICE_TYPES.ApplicationService);

        this.tenantRouter = new TenantRouter(tenantService);
        this.applicationRouter = new ApplicationRouter(applicationService);
    }

}

export default new App().express;