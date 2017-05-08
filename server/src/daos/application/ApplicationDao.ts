import {Application} from "../../domain/Application";
import {Tenant} from "../../domain/Tenant";

export interface ApplicationDao {
    save(tenantId: Tenant, application: Application, callback: (error: Error, application?: Application) => void): void

    getAllApplicationsForTenant(tenantId: string, callback: (error: Error, applications?: Application[]) => void): void

    getApplicationById(applicationId: string, callback: (error: Error, application?: Application) => void, populateRefs?: boolean): void

    deleteApplication(applicationId: string, callback: (error: Error, response) => void): void
}

