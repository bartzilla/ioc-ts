import {TenantDao} from "../TenantDao";
import {Tenant} from "../../../domain/Tenant";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class DefaultTenantDaoImpl implements TenantDao{
    save(tenant: Tenant, callback: (error: Error | undefined, tenant?: Tenant) => void): void {

        console.log('SAVE THE TENANT!!');
        let savedTenant = tenant;
        callback(undefined, tenant);
    }
}