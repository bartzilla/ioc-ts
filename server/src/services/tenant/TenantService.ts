import {Tenant} from "../../domain/Tenant";
import {ITenantModel} from "../../db/mongo/tenant/impl/TenantModel";

export interface TenantService {

    registerNewTenant(tenant: Tenant, callback: (error: Error | undefined, tenant?: Tenant) => void): void;

    findTenantById(tenantId: string, callback: (error: Error | undefined, tenant?: ITenantModel) => void): void;
}
