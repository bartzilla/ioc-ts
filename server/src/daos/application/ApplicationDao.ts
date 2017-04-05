import {Application} from "../../domain/Application";
import {ITenantModel} from "../../db/mongo/tenant/TenantModel";

export interface ApplicationDao {
    save(tenantId: ITenantModel, application: Application, callback: (error: Error, application?: Application) => void): void
}

