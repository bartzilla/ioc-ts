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

    authenticate(email: string, candidatePassword: string, callback: (error: Error, token?: string)=>void): void {

        var newTenant = new TenantModel();

        newTenant.findTenantsByEmail(email, (err: Error, tenants: ITenantModel[]) => {
            if(err) {
                throw err;
            }
            else {
                if (tenants.length > 0) {

                    // At the moment we only support one tenant per user, so we try to authenticate tenant
                    // in position zero
                    tenants[0].comparePasswords(candidatePassword, tenants[0].adminPassword, (err, isMatch) => {
                        if(err) throw err;
                        if (isMatch && !err) {
                            // Create token if the password matched and no error was thrown
                            var token = jwt.sign(tenants[0], Config.secret, {
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