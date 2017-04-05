import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import {TenantRouter} from "./server/src/routes/TenantRouter";
import container from "./server/src/config/inversify.config";
import DAO_TYPES from "./server/src/daos/types/dao-types";
import {ApplicationRouter} from "./server/src/routes/ApplicationRouter";
import {TenantDao} from "./server/src/daos/tenant/TenantDao";
import {ApplicationDao} from "./server/src/daos/application/ApplicationDao";

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
        let tenantDao = container.get<TenantDao>(DAO_TYPES.TenantDao);
        let applicationDao = container.get<ApplicationDao>(DAO_TYPES.ApplicationDao);

        this.tenantRouter = new TenantRouter(tenantDao);
        this.applicationRouter = new ApplicationRouter(applicationDao, tenantDao);
    }

}

export default new App().express;