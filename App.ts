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
import {ConsoleRouter} from "./server/src/routes/ConsoleRouter";
import {Config} from "./server/src/config/Config";
import {AccountRouter} from "./server/src/routes/AccountRouter";
import {AccountDao} from "./server/src/daos/account/AccountDao";
var passport = require('passport');
var TenantModel = require('./server/src/db/mongo/tenant/TenantModel');


// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;
    private config: Config;
    private tenantRouter: TenantRouter;
    private applicationRouter: ApplicationRouter;
    private accountRouter: AccountRouter;
    private consoleRouter: ConsoleRouter;

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
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: "*",
            preflightContinue: false
        };

        router.use(cors(options));

        // Initialize passport for use
        this.express.use(passport.initialize());
        this.config.configPassport();

        // placeholder route handler
        this.express.use('/', router);

        //tenant routes
        this.express.use('/v1/tenants', this.tenantRouter.getRouter());
        // application routes
        this.express.use('/v1/tenants', this.applicationRouter.getRouter());
        // account routes
        this.express.use('/v1/accounts', this.accountRouter.getRouter());

        // Admin Console routes
        this.express.use('/console', this.consoleRouter.getRouter());

        //enable pre-flight
        router.options("*", cors(options));
    }

    private injectDependencies(): void {

        // Services
        let tenantDao = container.get<TenantDao>(DAO_TYPES.TenantDao);
        let applicationDao = container.get<ApplicationDao>(DAO_TYPES.ApplicationDao);
        let accountDao = container.get<AccountDao>(DAO_TYPES.AccountDao);

        // API Routes
        this.config = new Config(tenantDao);
        this.tenantRouter = new TenantRouter(tenantDao);
        this.applicationRouter = new ApplicationRouter(applicationDao, tenantDao, accountDao);
        this.accountRouter = new AccountRouter(applicationDao, accountDao);

        // Admin Console Routes
        this.consoleRouter = new ConsoleRouter(tenantDao);
    }

}

export default new App().express;