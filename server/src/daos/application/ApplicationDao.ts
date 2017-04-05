import {Application} from "../../domain/Application";
import {Tenant} from "../../domain/Tenant";

export interface ApplicationDao {
    save(tenantId: Tenant, application: Application, callback: (error: Error, application?: Application) => void): void
}

