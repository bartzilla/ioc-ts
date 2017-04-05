import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from "cors";
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

        //options for cors midddleware
        const options:cors.CorsOptions = {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: "*",
            preflightContinue: false
        };

        router.use(cors(options));

        // placeholder route handler
        this.express.use('/', router);

        this.express.use('/v1/tenants', this.tenantRouter.getRouter());
        this.express.use('/v1/tenants', this.applicationRouter.getRouter());

        //enable pre-flight
        router.options("*", cors(options));
    }

    private injectDependencies(): void {
        let tenantDao = container.get<TenantDao>(DAO_TYPES.TenantDao);
        let applicationDao = container.get<ApplicationDao>(DAO_TYPES.ApplicationDao);

        this.tenantRouter = new TenantRouter(tenantDao);
        this.applicationRouter = new ApplicationRouter(applicationDao, tenantDao);
    }

}

export default new App().express;