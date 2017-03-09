import {Tenant} from "../../domain/Tenant";

export interface TenantService {
    registerNewTenant(tenant: Tenant): void;
}
