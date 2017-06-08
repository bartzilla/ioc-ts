import {Request, Response, Router} from "express";
import "reflect-metadata";
import {inject, injectable} from "inversify";
import DAO_TYPES from "../daos/types/dao-types";
import {ApplicationDao} from "../daos/application/ApplicationDao";
import passport = require("passport");
import {Application} from "../domain/Application";
import {Tenant} from "../domain/Tenant";
import {TenantDao} from "../daos/tenant/TenantDao";
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
    public constructor(@inject(DAO_TYPES.TenantDao) tenantDao: TenantDao,
                       @inject(DAO_TYPES.ApplicationDao) applicationDao: ApplicationDao,
                       @inject(DAO_TYPES.AccountDao) accountDao: AccountDao) {
        this.tenantDao = tenantDao;
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
        this.router.post('/', passport.authenticate('jwt', {session: false}), this.addApplication);

        this.router.get('/', this.getAllApplications);

        this.router.delete('/:applicationId', this.deleteApplicationById);

        this.router.get('/:applicationId/accounts', this.getAllAccounts);
    }

    private deleteApplicationById = (req: Request, res: Response) => {

        let applicationId = req.params.applicationId;

        this.applicationDao.deleteApplication(applicationId, (applicationsDaoErr: Error, daoApplication: Application) => {

            if(applicationsDaoErr) {
                console.log('[APPLICATION]: ERROR: Could not delete application.', applicationsDaoErr);
                return res.status(500).json({success: false, message: 'Error deleting application.'});
            }

            if (daoApplication == null) return res.status(404).json({success: false, message: 'The application was not found'});

            return res.status(200).json(daoApplication);
        });
    };

    private getAllApplications = (req: Request, res: Response) =>  {
        let tenantId = req.user.id;

        this.applicationDao.getAllApplicationsForTenant(tenantId, (applicationsDaoErr: Error, daoApplications: Application[]) => {

            if(applicationsDaoErr) {
                console.log('[APPLICATION]: ERROR: Could not retrieve applications for tenant.', applicationsDaoErr);
                return res.status(500).json({success: false, message: 'Error retrieving applications for tenant.'});
            }

            return res.status(200).json(daoApplications);
        });
    };

    private addApplication = (req: Request, res: Response) =>  {

        let tenantId = req.user.id;

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
                        return res.status(201).json(daoApplication);
                    }
                })
            });
        }else {
            return res.status(400).json({success: false, message: 'Required parameters for "name" must be specified'});
        }
    };

    private getAllAccounts = (req: Request, res: Response) =>  {
        let applicationId = req.params.applicationId;

        this.accountDao.getAllAccountsForApplication(applicationId, (accountsDaoErr: Error, daoAccounts: Account[]) => {

            if(accountsDaoErr) {
                console.log('[APPLICATION]: ERROR: Could not get accounts for given application.', accountsDaoErr);
                return res.status(500).json({success: false, message: 'Error getting accounts for give application.'});
            }

            if(daoAccounts.length <= 0) return res.status(404).json({success: false, message: 'The application was not found'});

            return res.status(200).json(daoAccounts);
        });
    };

    public getRouter(): Router {
        return this.router;
    }
}