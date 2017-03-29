import {Tenant} from "../../domain/Tenant";
import {ITenantModel} from "../../db/mongo/tenant/impl/TenantModel";

export interface TenantDao {

    save(tenant: Tenant, callback: (error: Error, tenant?: Tenant) => void): void

    getTenantById(tenantId: string, callback: (error: Error, tenant?: ITenantModel) => void): void
}
