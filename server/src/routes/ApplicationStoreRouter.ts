import {Request, Response, Router} from "express";
import {Application} from "../domain/Application";
import "reflect-metadata";
import {inject, injectable} from "inversify";
import DAO_TYPES from "../daos/types/dao-types";
import {ApplicationDao} from "../daos/application/ApplicationDao";
import {Account} from "../domain/Account";
import {AccountDao} from "../daos/account/AccountDao";
import passport = require("passport");

@injectable()
export class ApplicationStoreRouter {
    private applicationDao: ApplicationDao;
    private accountDao: AccountDao;
    private router: Router;

    /**
     * Initialize the ApplicationStoreRouter
     */
    public constructor(@inject(DAO_TYPES.ApplicationDao) applicationDao: ApplicationDao,
                       @inject(DAO_TYPES.AccountDao) accountDao: AccountDao) {
        this.applicationDao = applicationDao;
        this.accountDao = accountDao;
        this.router = Router();
        this.init();
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    private init() {
        this.router.post('/', passport.authenticate('jwt', {session: false}), this.mapApplicationAccount);
    }

    private mapApplicationAccount = (req: Request, res: Response) =>  {
        let applicationId = req.body.applicationId;
        let accountId= req.body.accountId;

        if(accountId && accountId.length >= 0){

            this.accountDao.getAccountById(accountId, (accountDaoErr: Error, account: Account) => {
                // get account
                if(accountDaoErr) {
                    console.log('[APLLICATION-ACCOUNT-MAPPING]: ERROR: Could not add account into application.', accountDaoErr);
                    return res.status(500).json({success: false, message: 'Error adding account into application.'});
                }

                // map account to application
                this.applicationDao.addAccount(applicationId, account, (applicationDaoErr: Error, application: Application) => {
                    if(applicationDaoErr) {
                        console.log('[APLLICATION-ACCOUNT-MAPPING]: ERROR: Could not add account into application.', applicationDaoErr);
                        return res.status(500).json({success: false, message: 'Error adding account into application.'});
                    }
                    else {

                        // map application to account
                        this.accountDao.addApplication(application, account, (accountDaoErr: Error, daoAccount: Account) => {
                            if(accountDaoErr) {
                                console.log('[APLLICATION-ACCOUNT-MAPPING]: ERROR: Could not add account into application.', accountDaoErr);
                                return res.status(500).json({success: false, message: 'Error adding account into application.'});
                            }
                            else {
                                return res.status(200).json(daoAccount);
                            }
                        });
                    }
                });
            });

        }else {
            return res.status(400).json({success: false, message: 'Required parameters "applicationId", "accountId" must be specified'});
        }
    };

    public getRouter(): Router {
        return this.router;
    }
}