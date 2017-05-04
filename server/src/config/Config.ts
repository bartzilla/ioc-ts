import * as mongoose from "mongoose";
import {TenantDao} from "../daos/tenant/TenantDao";
import DAO_TYPES from "../daos/types/dao-types";
import passport = require("passport");
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {ExtractJwt} from 'passport-jwt';
import {Strategy as JwtStrategy} from 'passport-jwt';

@injectable()
export class Config {

    public static secret: string = process.env.DOORMAN_SECRET;
    private static db_url: string = process.env.DOORMAN_DB_URL;
    private tenantDao: TenantDao;

    public constructor(@inject(DAO_TYPES.TenantDao) tenantDao: TenantDao) {
        this.tenantDao = tenantDao;
    }

    public static connectMongo(): void {
        mongoose.connect(Config.db_url);
    }

    public configPassport(): void {

        var opts = <any>{};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
        opts.secretOrKey = Config.secret;

        passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
            this.tenantDao.getTenantById(jwt_payload.tenantId, function (err, user) {
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
    }
}
