import {Application} from "./Application";
export class Account {

    private _email: string;
    private _password: string;
    private _applications: Array<Application>;

    constructor(email: string, password: string, applications?: Array<Application>)
    {
        this._email = email;
        this._password = password;
        this._applications = applications;
    }

    get email(): string
    {
        return this._email;
    }

    set email(value: string)
    {
        this._email = value;
    }

    get password(): string
    {
        return this._password;
    }

    set password(value: string)
    {
        this._password = value;
    }

    get applications(): Array<Application> {
        return this._applications;
    }

    set applications(value: Array<Application>) {
        this._applications = value;
    }
}
