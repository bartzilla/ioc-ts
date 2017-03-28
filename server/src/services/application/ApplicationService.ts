import {Application} from "../../domain/Application";

export interface ApplicationService {
    registerNewApplication(tenantId: string, application: Application, callback: (error: Error | undefined, application?: Application) => void): void;
}
