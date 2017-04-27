import {Tenant} from "../../domain/Tenant";

export interface TenantDao {

    save(tenant: Tenant, callback: (error: Error, tenant?: Tenant) => void): void

    getTenantById(tenantId: string, callback: (error: Error, tenant?: Tenant) => void): void

    getTenantsByEmail(email: string, callback: (error: Error, tenants?: Tenant[]) => void): void

    authenticate(email: string, candidatePassword: string, callback: (error: Error, token?: string) => void): void
}
