import {ApplicationDao} from "../ApplicationDao";
import {Application} from "../../../domain/Application";
import {injectable} from "inversify";
import "reflect-metadata";
// import {ApplicationModel} from "../../../db/mongo/impl/ApplicationModel"

@injectable()
export class DefaultApplicationDaoImpl implements ApplicationDao{
    save(tenantId: string, application: Application, callback: (error: Error | undefined, application?: Application) => void): void {

        // var newTenant = new TenantModel(tenant);
        //
        // newTenant.createTenant(newTenant, (err, tenant) => {
        //     if(err) {
        //         throw err;
        //     }
        //     else {
        //         console.log('Tenant successfully created: ', tenant);
        //         return callback(null, tenant);
        //     }
        // });
    }
}