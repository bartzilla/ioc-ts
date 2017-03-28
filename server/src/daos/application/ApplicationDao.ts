import {Application} from "../../domain/Application";

export interface ApplicationDao {
    save(tenantId: string, application: Application, callback: (error: Error, application?: Application) => void): void
}

