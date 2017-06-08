import {Router} from "express";
import * as passport from "passport";
export class PassportConfig {
    private router: Router;

    /**
     * Initialize the PassportConfigRouter
     */
    public constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.use('/', (req, res, callback ) => {
            passport.authenticate('jwt', {session: false}, function(err, user, info) {
                if (err) { return callback(err) }

                if (!user) {
                    let passportMessage = {
                        status: 401,
                        code: 401,
                        message: info.message,
                        moreInfo: "https://github.com/bartzilla/ioc-ts"
                    };

                    return res.json(passportMessage);
                }

                res.json(user);
            })(req, res, callback);
        });
    }

    public getAuthenticateRouter(): Router {
        return this.router;
    }
}
