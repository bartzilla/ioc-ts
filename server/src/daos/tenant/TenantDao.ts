import {Tenant} from "../../domain/Tenant";

export interface TenantDao {

    save(tenant: Tenant, callback: (error: Error, tenant?: Tenant) => void): void

    getTenantById(tenantId: string, callback: (error: Error, tenant?: Tenant) => void): void
}
