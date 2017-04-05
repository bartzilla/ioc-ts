import {Router, Request, Response, NextFunction} from 'express';
import {Application} from "../domain/Application";
import "reflect-metadata";
import {injectable, inject} from "inversify";
import DAO_TYPES from "../daos/types/dao-types";
import {ApplicationDao} from "../daos/application/ApplicationDao";
import {TenantDao} from "../daos/tenant/TenantDao";

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
    init() {
        this.router.post('/:tenantId/applications', this.addApplication);
    }

    public addApplication = (req: Request, res: Response, next: NextFunction) =>  {

        let tenantId = req.params.tenantId;

        if(req.body.applicationName && req.body.applicationName.length >= 0) {

            this.tenantDao.getTenantById(tenantId, (tenantDaoErr: Error, daoTenant) => {
                if(tenantDaoErr) {
                    console.log('[APPLICATION]: ERROR: Could not add application.', tenantDaoErr);
                    return res.status(500).json({success: false, message: 'Error adding application.'});
                } else {

                    // Create Application
                    let newApplication = new Application(req.body.applicationName);

                    this.applicationDao.save(daoTenant, newApplication, (applicationDaoErr: Error, daoApplication: Application) => {
                        if(applicationDaoErr) {
                            console.log('[APPLICATION]: ERROR: Could not add application.', applicationDaoErr);
                            return res.status(500).json({success: false, message: 'Error adding application.'});
                        }
                        else {
                            return res.status(200).json(daoApplication);
                        }
                    })
                }
            });
        }else {
            return res.status(400).json({success: false, message: 'Required parameters "applicationName" must be specified'});
        }
    };

    public getRouter(): Router {
        return this.router;
    }
}