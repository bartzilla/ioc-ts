import SERVICE_TYPES from "../services/types/service-types";
import container from "./inversify.config";
import {TenantService} from "../services/tenant/TenantService";
import {Tenant} from "../domain/Tenant";
import {Account} from "../domain/Account";
import {Application} from "../domain/Application";

export class Config {

    public static wireDependencies(): void {
        // Wire tenantService
        let tenantService = container.get<TenantService>(SERVICE_TYPES.TenantService);

        // Create mock accounts
        let account1 = new Account("1", "ciprianosanchez@gmail.com", "1234");
        let account2 = new Account("2", "dsireesanchez@gmail.com", "1234");
        let account3 = new Account("3", "karensanchez@gmail.com", "1234");

        // Add accounts to an array of accounts
        let accounts = new Array<Account>();
        accounts.push(account1);
        accounts.push(account2);
        accounts.push(account3);

        // Create mock application
        let app1 = new Application("1", "sable-sun", accounts);
        let applications = new Array<Application>();
        applications.push(app1);

        // Create a Tenant
        let newTenant = new Tenant("1","Microsoft", "cipriano.sanchez@microsoft.com", "1234", applications);

        tenantService.registerNewTenant(newTenant);
    }
}
