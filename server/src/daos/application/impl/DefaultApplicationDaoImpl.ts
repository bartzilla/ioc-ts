import {ApplicationDao} from "../ApplicationDao";
import {Application} from "../../../domain/Application";
import {injectable} from "inversify";
import "reflect-metadata";
import {Tenant} from "../../../domain/Tenant";
import {ITenantModel} from "../../../db/mongo/tenant/impl/TenantModel";
import {ApplicationModel} from "../../../db/mongo/application/impl/ApplicationModel";

@injectable()
export class DefaultApplicationDaoImpl implements ApplicationDao{
    save(tenant: ITenantModel, application: Application, callback: (error: Error | undefined, application?: Application) => void): void {

        let newApplication = new ApplicationModel(application);

        newApplication.createApplication(tenant, newApplication, (err, application) => {
            if(err) {
                throw err;
            }
            else {
                console.log('Application successfully created: ', application);
                return callback(null, application);
            }
        });
    }
}