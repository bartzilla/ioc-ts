import {Router, Request, Response, NextFunction} from 'express';
import "reflect-metadata";
import {injectable, inject} from "inversify";
import DAO_TYPES from "../daos/types/dao-types";
import {ApplicationDao} from "../daos/application/ApplicationDao";
import {TenantDao} from "../daos/tenant/TenantDao";
import * as passport from "passport";
import {Config} from "../config/Config";

@injectable()
export class ConsoleRouter {
    private tenantDao: TenantDao;
    private router: Router;

    /**
     * Initialize the ConsoleRouter
     */
    public constructor(@inject(DAO_TYPES.TenantDao) tenantDao: TenantDao) {
        this.tenantDao = tenantDao;
        this.router = Router();
        this.init();
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    private init() {
        this.router.post('/authenticate', this.authenticate);
        this.router.get('/dashboard', passport.authenticate('jwt', {session: false}), (req, res) => {

            res.json('It worked: User ID is: ' + req.user._id);

        });
    }

    private authenticate = (req: Request, res: Response, next: NextFunction) =>  {

        this.tenantDao.authenticate(req.body.email, req.body.password, (err, token) => {
            if(err) {
                throw err;
            }else if(typeof token === 'undefined' || token === null){
                console.log('This is the token ', token);
                return res.status(401).json({success: false, message: 'Authentication failed: Invalid credentials.'});
            } else {
                return res.status(200).json({ success: true, token: 'JWT ' + token });
            }
        });
    };

    private login = (req: Request, res: Response, next: NextFunction) =>  {
        res.json("I am in login route");
    };

    public getRouter(): Router {
        return this.router;
    }
}