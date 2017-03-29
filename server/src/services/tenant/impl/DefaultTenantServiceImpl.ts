import {TenantService} from "../TenantService";
import {Tenant} from "../../../domain/Tenant";
import {injectable, inject} from "inversify";
import {TenantDao} from "../../../daos/tenant/TenantDao";
import "reflect-metadata";
import TYPES from "../../../daos/types/dao-types";
import {ITenantModel} from "../../../db/mongo/tenant/impl/TenantModel";

@injectable()
export class DefaultTenantServiceImpl implements TenantService {

    private tenantDao: TenantDao;

    public constructor(@inject(TYPES.TenantDao) tenantDao: TenantDao) {
        this.tenantDao = tenantDao;
    }

    public registerNewTenant(tenant: Tenant, callback: (err: Error | undefined, tenant?: Tenant) => void): void {

        if(typeof callback === "function"){
            this.tenantDao.save(tenant, (daoErr: Error, daoTenant: Tenant) => {

                if(daoErr) return callback(daoErr);

                callback(undefined, daoTenant);
            });
        }else {
            console.log('[doormanjs]: Callback was not provided');
        }
    }

    public findTenantById(tenantId: string, callback: (error: (Error|any), tenant?: ITenantModel) => void): void {
        if(typeof callback === "function"){
            this.tenantDao.getTenantById(tenantId, (daoErr: Error, daoTenant: ITenantModel) => {

                if(daoErr) return callback(daoErr);

                callback(undefined, daoTenant);
            });
        }else {
            console.log('[doormanjs]: Callback was not provided');
        }
    }
}
