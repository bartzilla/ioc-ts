import {TenantService} from "../TenantService";
import {Tenant} from "../../../domain/Tenant";
import {injectable, inject} from "inversify";
import DAO_TYPES from "../../../daos/types/dao-types";
import {TenantDao} from "../../../daos/tenant/TenantDao";
import "reflect-metadata";

@injectable()
export class DefaultTenantServiceImpl implements TenantService {

    @inject(DAO_TYPES.TenantDao)
    private tenantDao: TenantDao;

    public registerNewTenant(tenant: Tenant): void {
        this.tenantDao.save(tenant);
    }

}
