import {Tenant} from "../../domain/Tenant";

export interface TenantDao {
    save(tenant: Tenant): void;
}
