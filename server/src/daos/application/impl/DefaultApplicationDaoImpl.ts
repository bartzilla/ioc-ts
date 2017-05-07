import {ApplicationDao} from "../ApplicationDao";
import {Application} from "../../../domain/Application";
import {injectable} from "inversify";
import "reflect-metadata";
import {ApplicationModel} from "../../../db/mongo/application/ApplicationModel";
import {TenantModel, ITenantModel} from "../../../db/mongo/tenant/TenantModel"
import {Tenant} from "../../../domain/Tenant";

@injectable()
export class DefaultApplicationDaoImpl implements ApplicationDao {

    deleteApplication(tenantId: string, applicationId: string, callback: (error: Error, response)=>void): void {
    }

    save(tenant: Tenant, application: Application, callback: (error: Error | undefined, application?: Application) => void): void {

        let newApplication = new ApplicationModel({name: application.name, description: application.description});

        newApplication.createApplication(tenant, newApplication, (err: Error, application: Application) => {
            if(err) {
                throw err;
            }
            else {
                console.log('Application successfully created: ', application);
                return callback(null, application);
            }
        });
    }

    getAllApplicationsForTenant(tenantId: string, callback: (err: Error, applications?: Application[])=>void): void {
        let newTenant = new TenantModel();

        newTenant.findTenantById(tenantId, (err: Error, tenant: Tenant) => {
            if(err) {
                throw err;
            }
            else {
                // check if tenant has no apps. Undefined or null
                if (tenant == null) return callback(null, []);

                return callback(null, tenant.applications);
            }
        }, true);
    }
}