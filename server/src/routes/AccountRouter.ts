import {Router, Request, Response} from 'express';
import "reflect-metadata";
import {injectable, inject} from "inversify";
import DAO_TYPES from "../daos/types/dao-types";
import passport = require("passport");
import {AccountDao} from "../daos/account/AccountDao";
import {Account} from "../domain/Account";

@injectable()
export class AccountRouter {
    private accountDao: AccountDao;
    private router: Router;

    /**
     * Initialize the ApplicationRouter
     */
    public constructor(@inject(DAO_TYPES.AccountDao) accountDao: AccountDao) {
        this.accountDao = accountDao;
        this.router = Router();
        this.init();
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    private init() {
        this.router.post('/', passport.authenticate('jwt', {session: false}), this.addAccount);
        this.router.get('/', passport.authenticate('jwt', {session: false}), this.getAllAccounts);
        this.router.delete('/:accountId', passport.authenticate('jwt', {session: false}), this.deleteAccountById);
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
                    return res.status(201).json(daoAccount);
                }
            });
        } else {
            return res.status(400).json({success: false, message: 'Required parameters "email" and "password" must be specified'});
        }
    };

    private getAllAccounts = (req: Request, res: Response) =>  {
        let tenantId = req.user.id;

        // this.accountDao.getAllAccountsForTenant(tenantId, (accountsDaoErr: Error, daoAccounts: Account[]) => {
        //
        //     if(accountsDaoErr) {
        //         console.log('[ACCOUNTS]: ERROR: Could not retrieve accounts for tenant.', accountsDaoErr);
        //         return res.status(500).json({success: false, message: 'Error retrieving accounts for tenant.'});
        //     }
        //
        //     return res.status(200).json(daoAccounts);
            return res.status(200).json({success: true, message: "Returning soon all accounts"});
        // });
    };

    private deleteAccountById = (req: Request, res: Response) => {

        let accountId = req.params.accountId;

        this.accountDao.deleteAccount(accountId, (accountDaoErr: Error, daoAccount: Account) => {

            if(daoAccount) {
                console.log('[ACCOUNTS]: ERROR: Could not delete account.', daoAccount);
                return res.status(500).json({success: false, message: 'Error deleting account.'});
            }

            if (daoAccount == null) return res.status(404).json({success: false, message: 'The account was not found'});

            return res.status(200).json(daoAccount);
        });
    };

    public getRouter(): Router {
        return this.router;
    }
}