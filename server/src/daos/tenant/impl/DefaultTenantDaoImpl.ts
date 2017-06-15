import {TenantDao} from "../TenantDao";
import {Tenant} from "../../../domain/Tenant";
import {injectable} from "inversify";
import "reflect-metadata";
import * as jwt from "jsonwebtoken";
import {TenantModel, ITenantModel} from "../../../db/mongo/tenant/TenantModel"
import {Config} from "../../../config/Config";

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
                return callback(err);
            }
            else {
                console.log('Tenant successfully created: ', tenant);
                return callback(null, tenant);
            }
        });
    }

    getTenantById(tenantId: string, callback: (error: Error, tenant?: Tenant) => void, populateRefs?: boolean): void {
        let tenant = new TenantModel();

        tenant.findTenantById(tenantId, (err: Error, tenant: Tenant) => {
            if(err) {
                return callback(err);
            }
            else {
                console.log('Tenant successfully retrieved: ', tenant);
                return callback(null, tenant);
            }
        }, populateRefs);
    }

    getTenantsByEmail(email: string, callback: (err: Error, tenants?: Tenant[])=>void, populateRefs?: boolean): void {
        let newTenant = new TenantModel();

        newTenant.findTenantsByEmail(email, (err: Error, tenants: Tenant[]) => {
            if(err) {
                return callback(err);
            }
            else {
                console.log('Tenant successfully retrieved: ', tenants);
                return callback(null, tenants);
            }
        }, populateRefs);
    }

    authenticate(email: string, candidatePassword: string, callback: (error: Error, token?: string)=>void): void {

        let newTenant = new TenantModel();

        newTenant.findTenantsByEmail(email, (err: Error, tenants: ITenantModel[]) => {
            if(err) {
                return callback(err);
            }
            else {
                if (tenants.length > 0) {

                    // At the moment we only support one tenant per user, so we try to authenticate tenant
                    // in position zero
                    tenants[0].comparePasswords(candidatePassword, tenants[0].adminPassword, (err, isMatch) => {
                        if(err) return callback(err);
                        if (isMatch && !err) {
                            // Create token if the password matched and no error was thrown
                            console.log(tenants[0]._id);
                            let payload = {
                                adminEmail: tenants[0].adminEmail,
                                tenantName: tenants[0].tenantName,
                                applications: tenants[0].applications,
                                tenantId: tenants[0]._id
                            };

                            let token = jwt.sign(payload, Config.secret, {
                                expiresIn: 3600 // in seconds. represents 1 hour
                            });
                            return callback(null, token);
                        } else {
                            return callback(null);
                        }
                    })
                } else {
                    return callback(null);
                }
            }
        });
    }
}