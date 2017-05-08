import {Router, Request, Response, NextFunction} from 'express';
import {Application} from "../domain/Application";
import "reflect-metadata";
import {injectable, inject} from "inversify";
import DAO_TYPES from "../daos/types/dao-types";
import {ApplicationDao} from "../daos/application/ApplicationDao";
import {TenantDao} from "../daos/tenant/TenantDao";
import passport = require("passport");
import {Tenant} from "../domain/Tenant";

@injectable()
export class ApplicationRouter {
    private applicationDao: ApplicationDao;
    private tenantDao: TenantDao;
    private router: Router;

    /**
     * Initialize the ApplicationRouter
     */
    public constructor(@inject(DAO_TYPES.ApplicationDao) applicationDao: ApplicationDao,
                       @inject(DAO_TYPES.TenantDao) tenantDao: TenantDao) {
        this.applicationDao = applicationDao;
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

    public getRouter(): Router {
        return this.router;
    }
}