import {TenantService} from "../TenantService";
import {Tenant} from "../../../domain/Tenant";
import {injectable, inject} from "inversify";
import {TenantDao} from "../../../daos/tenant/TenantDao";
import "reflect-metadata";
import TYPES from "../../../daos/types/dao-types";

@injectable()
export class DefaultTenantServiceImpl implements TenantService {

    private tenantDao: TenantDao;

    public constructor(@inject(TYPES.TenantDao) tenantDao: TenantDao) {
        this.tenantDao = tenantDao;
    }

    public registerNewTenant(tenant: Tenant): void {
        this.tenantDao.save(tenant);
    }

}
