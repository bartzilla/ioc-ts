import {Tenant} from "../../domain/Tenant";
import {Application} from "../../domain/Application";
export interface ITenant {
    _tenantName: string;
    _adminEmail?: string;
    _adminPassword: string;
    _role: string;
    _applications: Array<Application>;
}
