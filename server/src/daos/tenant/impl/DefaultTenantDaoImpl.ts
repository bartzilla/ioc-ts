import {TenantDao} from "../TenantDao";
import {Tenant} from "../../../domain/Tenant";
import {injectable} from "inversify";
import "reflect-metadata";
import {TenantModel} from "../../../db/mongo/tenant/impl/TenantModel"

@injectable()
export class DefaultTenantDaoImpl implements TenantDao {
    save(tenant: Tenant, callback: (error: Error | undefined, tenant?: Tenant) => void): void {

        var newTenant = new TenantModel(tenant);

        newTenant.createTenant(newTenant, (err, tenant) => {
            if(err) {
                throw err;
            }
            else {
                console.log('Tenant successfully created: ', tenant);
                return callback(null, tenant);
            }
        });
    }

    getTenantById(tenantId: string, callback: (error: Error, tenant?: Tenant)=>void): void {

        var newTenant = new TenantModel();

        newTenant.findById(tenantId, (err, tenant) => {
            if(err) {
                throw err;
            }
            else {
                console.log('Tenant successfully retrieved: ', tenant);
                return callback(null, tenant);
            }
        });

    }
}