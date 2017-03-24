import {Application} from "./Application";
export class Tenant {

    private _tenantName: string;
    private _adminEmail: string;
    private _adminPassword: string;
    private _applications: Array<Application>;

    constructor(tenantName: string, adminEmail: string, adminPassword: string) {

        this._tenantName = tenantName;
        this._adminEmail = adminEmail;
        this._adminPassword = adminPassword;
    }

    get tenantName(): string {
        return this._tenantName;
    }

    set tenantName(value: string) {
        this._tenantName = value;
    }

    get adminEmail(): string {
        return this._adminEmail;
    }

    set adminEmail(value: string) {
        this._adminEmail = value;
    }

    get adminPassword(): string {
        return this._adminPassword;
    }

    set adminPassword(value: string) {
        this._adminPassword = value;
    }

    get applications(): Array<Application> {
        return this._applications;
    }

    set applications(value: Array<Application>) {
        this._applications = value;
    }
}
