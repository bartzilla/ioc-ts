import {Router, Request, Response, NextFunction} from "express";
import {Tenant} from "../domain/Tenant";
import "reflect-metadata";
import {injectable, inject} from "inversify";
import DAO_TYPES from "../daos/types/dao-types";
import {TenantDao} from "../daos/tenant/TenantDao";

@injectable()
export class TenantRouter {
    private tenantDao: TenantDao;
    private router: Router;

    /**
     * Initialize the TenantRouter
     */
    public constructor(@inject(DAO_TYPES.TenantDao) tenantDao?: TenantDao) {
        this.tenantDao = tenantDao;
        this.router = Router();
        this.init();
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    private init() {
        this.router.post('/', this.addTenant);
        this.router.get('/:email', this.getTenantsByEmail);
    }

    private addTenant = (req: Request, res: Response, next: NextFunction) =>  {

        if(req.body.email && req.body.email.length >= 0
            && req.body.tenantName && req.body.tenantName.length >= 0
            && req.body.password && req.body.password.length >= 0){

            let tenantName = req.body.tenantName;
            let adminEmail = req.body.email;
            let adminPassword = req.body.password;

            let newTenant = new Tenant(tenantName, adminEmail, adminPassword);

            this.tenantDao.save(newTenant, (daoErr: Error, daoTenant: Tenant) => {

                if(daoErr) {
                    console.log('[TENANTS]: ERROR: Could not add tenant.', daoErr);
                    return res.status(500).json({success: false, message: 'Error adding tenant.'});
                }

                return res.status(200).json(daoTenant);
            });

        } else {
            return res.status(400).json({success: false, message: 'Required parameters "email" and "password" must be specified'});
        }
    };

    private getTenantsByEmail = (req: Request, res: Response, next: NextFunction) => {
        let email = req.params.email;

        this.tenantDao.getTenantsByEmail(email, (daoErr: Error, daoTenants: Tenant[]) => {

            if(daoErr) {
                console.log('[TENANT]: ERROR: Could not find tenant.', daoErr);
                return res.status(500).json({success: false, message: 'Error while finding tenants by email.'});
            }

            return res.status(200).json(daoTenants);
        });
    };

    public getRouter(): Router {
        return this.router;
    }
}