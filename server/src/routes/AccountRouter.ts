import {Router, Request, Response, NextFunction} from 'express';
import "reflect-metadata";
import {injectable, inject} from "inversify";
import DAO_TYPES from "../daos/types/dao-types";
import {ApplicationDao} from "../daos/application/ApplicationDao";
import passport = require("passport");
import {AccountDao} from "../daos/account/AccountDao";
import {Account} from "../domain/Account";

@injectable()
export class AccountRouter {
    private applicationDao: ApplicationDao;
    private accountDao: AccountDao;
    private router: Router;

    /**
     * Initialize the ApplicationRouter
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
        // this.router.post('/:applicationId/accounts', passport.authenticate('jwt', {session: false}), this.addAccount);
        this.router.post('/', passport.authenticate('jwt', {session: false}), this.addAccount);
        this.router.delete('/:accountId', passport.authenticate('jwt', {session: false}), this.deleteAccountById);

        this.router.get('/:applicationId/accounts', passport.authenticate('jwt', {session: false}), this.getAllAccounts);
    }

    private addAccount = (req: Request, res: Response) =>  {
        if(req.body.email && req.body.email.length >= 0
            && req.body.password && req.body.password.length >= 0){

            // Create Account
            let newAccount = new Account(req.body.email, req.body.password);

            this.accountDao.save(newAccount, (accountDaoErr: Error, daoAccount: Account) => {
                if(accountDaoErr) {
                    console.log('[ACCOUNTS]: ERROR: Could not add account.', accountDaoErr);
                    return res.status(500).json({success: false, message: 'Error adding account.'});
                }
                else {
                    return res.status(200).json(daoAccount);
                }
            });
        } else {
            return res.status(400).json({success: false, message: 'Required parameters "email" and "password" must be specified'});
        }
    };

    private getAllAccounts = (req: Request, res: Response) =>  {
        let applicationId = req.params.applicationId;

        this.accountDao.getAllAccountsForApplication(applicationId, (accountsDaoErr: Error, daoAccounts: Account[]) => {

            if(accountsDaoErr) {
                console.log('[ACCOUNTS]: ERROR: Could not retrieve accounts for given application.', accountsDaoErr);
                return res.status(500).json({success: false, message: 'Error retrieving accounts for given application.'});
            }

            return res.status(200).json(daoAccounts);
        });
    };

    private deleteAccountById = (req: Request, res: Response) => {

        let accountId = req.params.accountId;

        this.accountDao.deleteAccount(accountId, (accountDaoErr: Error, daoAccount: any) => {
            return res.status(200).json(daoAccount);
        });
    };

    public getRouter(): Router {
        return this.router;
    }
}