import SERVICE_TYPES from "../services/types/service-types";
import container from "./inversify.config";
import {TenantService} from "../services/tenant/TenantService";
import {Tenant} from "../domain/Tenant";
import {Account} from "../domain/Account";
import {Application} from "../domain/Application";
import * as mongoose from "mongoose";

export class Config {

    public static wireDependencies(): void {

        mongoose.connect('mongodb://localhost/ioc-ts');

        // Wire tenantService
        let tenantService = container.get<TenantService>(SERVICE_TYPES.TenantService);

        // Create mock accounts
        let account1 = new Account("ciprianosanchez@gmail.com", "1234");
        let account2 = new Account("dsireesanchez@gmail.com", "1234");
        let account3 = new Account("karensanchez@gmail.com", "1234");

        // Add accounts to an array of accounts
        let accounts = new Array<Account>();
        accounts.push(account1);
        accounts.push(account2);
        accounts.push(account3);

        // Create mock application
        let app1 = new Application("sable-sun", accounts);
        let applications = new Array<Application>();
        applications.push(app1);

        // Create a Tenant
        let newTenant = new Tenant("Microsoft", "cipriano.sanchez@microsoft.com", "1234");

        tenantService.registerNewTenant(newTenant, () => {
            console.log('Should be done');
        });
    }
}
