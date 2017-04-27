import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from "cors";
import * as passport from "passport";
import {TenantRouter} from "./server/src/routes/TenantRouter";
import container from "./server/src/config/inversify.config";
import DAO_TYPES from "./server/src/daos/types/dao-types";
import {ApplicationRouter} from "./server/src/routes/ApplicationRouter";
import {TenantDao} from "./server/src/daos/tenant/TenantDao";
import {ApplicationDao} from "./server/src/daos/application/ApplicationDao";
import {ConsoleRouter} from "./server/src/routes/ConsoleRouter";
import {Config} from "./server/src/config/Config";
import * as mongoose from "mongoose";
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JwtStrategy = require('passport-jwt').Strategy;
var User = require('./server/src/db/mongo/tenant/TenantModel');
var TenantModel = require('./server/src/db/mongo/tenant/TenantModel');


// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;
    public passport: any;
    private tenantRouter: TenantRouter;
    private applicationRouter: ApplicationRouter;
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

        // Bring in passport strategy we just defined
        // require('./server/src/config/passport')(passport);

        console.log("SECOND");
        // Initialize passport for use
        this.express.use(passport.initialize());


        var opts = <any>{};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
        opts.secretOrKey = "putsomethingsecrethere";

        this.passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
            console.log('ID: ', jwt_payload.id);
            User.findById({id: jwt_payload.id}, function (err, user) {

                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        }));
        console.log('Well Strategy', passport);
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

        // API Router
        this.express.use('/v1/tenants', this.tenantRouter.getRouter());
        this.express.use('/v1/tenants', this.applicationRouter.getRouter());

        // Admin Console routes
        this.express.use('/console', this.consoleRouter.getRouter());

        //enable pre-flight
        router.options("*", cors(options));
    }

    private injectDependencies(): void {
        let tenantDao = container.get<TenantDao>(DAO_TYPES.TenantDao);
        let applicationDao = container.get<ApplicationDao>(DAO_TYPES.ApplicationDao);

        this.tenantRouter = new TenantRouter(tenantDao);
        this.applicationRouter = new ApplicationRouter(applicationDao, tenantDao);
        this.consoleRouter = new ConsoleRouter(tenantDao);
    }

}

export default new App().express;