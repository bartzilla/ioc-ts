import {TenantDao} from "../TenantDao";
import {Tenant} from "../../../domain/Tenant";
import {injectable} from "inversify";
import "reflect-metadata";
import {TenantModel} from "../../../db/mongo/tenant/TenantModel"

@injectable()
export class DefaultTenantDaoImpl implements TenantDao {
    save(tenant: Tenant, callback: (error: Error | undefined, tenant?: Tenant) => void): void {
        let newTenant = new TenantModel({
            tenantName: tenant.tenantName,
            adminEmail: tenant.adminEmail,
            adminPassword: tenant.adminPassword
        });

        newTenant.createTenant(newTenant, (err: Error, tenant: Tenant) => {
            if(err) {
                throw err;
            }
            else {
                console.log('Tenant successfully created: ', tenant);
                return callback(null, tenant);
            }
        });
    }

    getTenantById(tenantId: string, callback: (error: Error, tenant?: Tenant) => void): void {
        var newTenant = new TenantModel();

        newTenant.findById(tenantId, (err: Error, tenant: Tenant) => {
            if(err) {
                throw err;
            }
            else {
                console.log('Tenant successfully retrieved: ', tenant);
                return callback(null, tenant);
            }
        });
    }

    getTenantsByEmail(email: string, callback: (err: Error, tenants?: Tenant[])=>void): void {
        var newTenant = new TenantModel();

        newTenant.findTenantsByEmail(email, (err: Error, tenants: Tenant[]) => {
            if(err) {
                throw err;
            }
            else {
                console.log('Tenant successfully retrieved: ', tenants);
                return callback(null, tenants);
            }
        });
    }
}