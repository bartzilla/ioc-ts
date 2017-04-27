import * as mongoose from "mongoose";
import * as passportJwt from 'passport-jwt'
var JwtStrategy = require('passport-jwt').Strategy;
var User = require('../db/mongo/tenant/TenantModel');

export class Config {

    public static secret: String = 'putsomethingtopsecrethere';

    public static connectMongo(): void {
        mongoose.connect('mongodb://localhost/ioc-ts');
    }

    public static configPassport(passport) {
        var opts = <any>{};
        opts.jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeader();
        opts.secretOrKey = "putsomethingsecrethere";
        console.log("DO STUFF", passport);
        passport.use(new JwtStrategy(opts, function (jwt_payload, done) {

            User.findById({id: jwt_payload.id}, function (err, user) {
                console.log('Well there was an error', err);
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
