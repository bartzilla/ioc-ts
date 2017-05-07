import {Account} from "./Account";
export class Application {

    private _name: string;
    private _description: string;
    private _accounts: Array<Account>;

    constructor(name: string, description?: string, accounts?: Array<Account>) {
        this._name = name;
        this._accounts = accounts;
        this._description = description;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get accounts(): Array<Account> {
        return this._accounts;
    }

    set accounts(value: Array<Account>) {
        this._accounts = value;
    }
}