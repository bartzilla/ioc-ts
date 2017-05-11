import {Router, Request, Response, NextFunction} from 'express';
import {Application} from "../domain/Application";
import "reflect-metadata";
import {injectable, inject} from "inversify";
import DAO_TYPES from "../daos/types/dao-types";
import {ApplicationDao} from "../daos/application/ApplicationDao";
import {TenantDao} from "../daos/tenant/TenantDao";
import passport = require("passport");
import {Tenant} from "../domain/Tenant";
import {Account} from "../domain/Account";
import {AccountDao} from "../daos/account/AccountDao";

@injectable()
export class ApplicationRouter {
    private applicationDao: ApplicationDao;
    private tenantDao: TenantDao;
    private accountDao: AccountDao;
    private router: Router;

    /**
     * Initialize the ApplicationRouter
     */
    public constructor(@inject(DAO_TYPES.ApplicationDao) applicationDao: ApplicationDao,
                       @inject(DAO_TYPES.TenantDao) tenantDao: TenantDao,
                       @inject(DAO_TYPES.AccountDao) accountDao: AccountDao) {
        this.applicationDao = applicationDao;
        this.accountDao = accountDao;
        this.tenantDao = tenantDao;
        this.router = Router();
        this.init();
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    private init() {
        this.router.post('/:tenantId/applications', passport.authenticate('jwt', {session: false}), this.addApplication);
        this.router.post('/:tenantId/applications/:applicationId/accounts', passport.authenticate('jwt', {session: false}), this.mapAccountApplication);
        this.router.get('/:tenantId/applications', passport.authenticate('jwt', {session: false}), this.getAllApplications);
        this.router.delete('/applications/:appId', passport.authenticate('jwt', {session: false}), this.deleteApplicationById);
    }

    private deleteApplicationById = (req: Request, res: Response) => {

        let appId = req.params.appId;

        this.applicationDao.deleteApplication(appId, (applicationsDaoErr: Error, daoApplication: any) => {
            return res.status(200).json(daoApplication);
        });
    };

    private getAllApplications = (req: Request, res: Response) =>  {
        let tenantId = req.params.tenantId;

        this.applicationDao.getAllApplicationsForTenant(tenantId, (applicationsDaoErr: Error, daoApplications: Application[]) => {

            if(applicationsDaoErr) {
                console.log('[APPLICATION]: ERROR: Could not retrieve applications for tenant.', applicationsDaoErr);
                return res.status(500).json({success: false, message: 'Error retrieving applications for tenant.'});
            }

            return res.status(200).json(daoApplications);
        });
    };

    private addApplication = (req: Request, res: Response) =>  {

        let tenantId = req.params.tenantId;

        if(req.body.name && req.body.name.length >= 0) {

            this.tenantDao.getTenantById(tenantId, (tenantDaoErr: Error, daoTenant: Tenant) => {
                if(tenantDaoErr) {
                    console.log('[APPLICATION]: ERROR: Could not add application.', tenantDaoErr);
                    return res.status(500).json({success: false, message: 'Error adding application.'});
                }

                // Create Application
                let newApplication = new Application(req.body.name, req.body.description);

                this.applicationDao.save(daoTenant, newApplication, (applicationDaoErr: Error, daoApplication: Application) => {
                    if(applicationDaoErr) {
                        console.log('[APPLICATION]: ERROR: Could not add application.', applicationDaoErr);
                        return res.status(500).json({success: false, message: 'Error adding application.'});
                    }
                    else {
                        return res.status(200).json(daoApplication);
                    }
                })
            });
        }else {
            return res.status(400).json({success: false, message: 'Required parameters for "name" must be specified'});
        }
    };

    private mapAccountApplication = (req: Request, res: Response) =>  {

        let applicationId = req.params.applicationId;
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
                        // return res.status(200).json(application);
                            }
                        });

                    }
                });

            });

        }else {
            return res.status(400).json({success: false, message: 'Required parameter "accountId" must be specified'});
        }
    };

    public getRouter(): Router {
        return this.router;
    }
}