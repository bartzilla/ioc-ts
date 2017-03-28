import {Tenant} from "../../domain/Tenant";

export interface TenantService {

    registerNewTenant(tenant: Tenant, callback: (error: Error | undefined, tenant?: Tenant) => void): void;

    findTenantById(tenantId: string, callback: (error: Error | undefined, tenant?: Tenant) => void): void;
}
