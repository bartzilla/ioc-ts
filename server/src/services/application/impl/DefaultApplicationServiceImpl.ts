import {ApplicationService} from "../ApplicationService";
import {Application} from "../../../domain/Application";
import {injectable, inject} from "inversify";
import {ApplicationDao} from "../../../daos/application/ApplicationDao";
import "reflect-metadata";
import TYPES from "../../../daos/types/dao-types";
import {TenantDao} from "../../../daos/tenant/TenantDao";
import {Tenant} from "../../../domain/Tenant";

@injectable()
export class DefaultApplicationServiceImpl implements ApplicationService {

    private applicationDao: ApplicationDao;
    private tenantDao: TenantDao;

    public constructor(@inject(TYPES.ApplicationDao) applicationDao: ApplicationDao,
                       @inject(TYPES.TenantDao) tenantDao: TenantDao) {
        this.applicationDao = applicationDao;
        this.tenantDao = tenantDao;
    }

    public registerNewApplication(tenantId: string, application: Application, callback: (err: Error | undefined, application?: Application) => void): void {



        this.tenantDao.getTenantById(tenantId, (err: Error, tenant: Tenant) => {
            console.log("First find Tenant");
        });

        // if(typeof callback === "function"){
        //     this.tenantDao.save(tenant, (daoErr: Error, daoTenant: Application) => {
        //
        //         if(daoErr) return callback(daoErr);
        //
        //         callback(undefined, daoTenant);
        //     });
        // }else {
        //     console.log('[doormanjs]: Callback was not provided');
        // }
    }
}
