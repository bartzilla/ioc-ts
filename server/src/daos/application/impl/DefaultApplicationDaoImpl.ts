import {ApplicationDao} from "../ApplicationDao";
import {Application} from "../../../domain/Application";
import {injectable} from "inversify";
import "reflect-metadata";
import {ApplicationModel} from "../../../db/mongo/application/ApplicationModel";
import {Tenant} from "../../../domain/Tenant";

@injectable()
export class DefaultApplicationDaoImpl implements ApplicationDao{
    save(tenant: Tenant, application: Application, callback: (error: Error | undefined, application?: Application) => void): void {

        let newApplication = new ApplicationModel({name: application.name});

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
}