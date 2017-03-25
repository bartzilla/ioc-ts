import {Router, Request, Response, NextFunction} from 'express';
import {TenantService} from "../services/tenant/TenantService";
import {Tenant} from "../domain/Tenant";
import "reflect-metadata";
import {injectable, inject} from "inversify";
import TYPES from "../services/types/service-types";

@injectable()
export class TenantRouter {
    private tenantService: TenantService;
    private router: Router;

    /**
     * Initialize the TenantRouter
     */
    public constructor(@inject(TYPES.TenantService) tenantService?: TenantService) {
        this.tenantService = tenantService;
        this.router = Router();
        this.init();
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/', this.addTenant);
    }

    public addTenant = (req: Request, res: Response, next: NextFunction) =>  {

        if(req.body.email && req.body.email.length >= 0
            && req.body.tenantName && req.body.tenantName.length >= 0
            && req.body.password && req.body.password.length >= 0){

            let tenantName = req.body.tenantName;
            let adminEmail = req.body.email;
            let adminPassword = req.body.password;

            let newTenant = new Tenant(tenantName, adminEmail, adminPassword);

            this.tenantService.registerNewTenant(newTenant, function(err, tenant){
                if(err) {
                    console.log('[TENANTS]: ERROR: Could not add tenant.', err);
                    return res.status(500).json({success: false, message: 'Error adding tenant.'});
                }
                else {
                    return res.status(200).json(tenant);
                }
            });
        }else {
            return res.status(400).json({success: false, message: 'Required parameters "email" and "password" must be specified'});
        }
    };

    public getRouter(): Router {
        return this.router;
    }
}