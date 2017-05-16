import {ApplicationDao} from "../ApplicationDao";
import {Application} from "../../../domain/Application";
import {injectable} from "inversify";
import "reflect-metadata";
import {ApplicationModel} from "../../../db/mongo/application/ApplicationModel";
import {TenantModel, ITenantModel} from "../../../db/mongo/tenant/TenantModel"
import {Tenant} from "../../../domain/Tenant";

@injectable()
export class DefaultApplicationDaoImpl implements ApplicationDao {
    addAccount(applicationId: string, account: Account, callback: (error: Error, application?: Application)=>void): void {

        let applicationModel = new ApplicationModel();

        applicationModel.addAccount(applicationId, account, (err: Error, application: Application) => {
            if(err) {
                return callback(err);
            }
            else {
                console.log('Account successfully added to application: ', application);
                return callback(null, application);
            }
        });
    }

    getApplicationById(applicationId: string, callback: (error: Error, application?: Application)=>void, populateRefs?: boolean): void {
        let applicationModel = new ApplicationModel();

        applicationModel.findApplicationById(applicationId, (err: Error, application: Application) => {
            if(err) {
                return callback(err);
            }
            else {
                console.log('Applicaiton successfully retrieved: ', application);
                return callback(null, application);
            }
        }, populateRefs);
    }

    deleteApplication(applicationId: string, callback: (error: Error, response?) => void): void {

        let application = new ApplicationModel();

        application.deleteApplication(applicationId, (err: Error, appId: string) => {
            if(err) {
                return callback(err);
            }
            else {
                console.log('Application successfully deleted: ', appId);
                return callback(null, appId);
            }
        });
    }

    save(tenant: Tenant, application: Application, callback: (error: Error | undefined, application?: Application) => void): void {

        let newApplication = new ApplicationModel({name: application.name, description: application.description});

        newApplication.createApplication(tenant, newApplication, (err: Error, application: Application) => {
            if(err) {
                return callback(err);
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