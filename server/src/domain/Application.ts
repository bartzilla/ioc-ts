import {Account} from "./Account";
export class Application {

    private _name: string;
    private _accounts: Array<Account>;

    constructor(name: string, accounts?: Array<Account>) {
        this._name = name;
        this._accounts = accounts;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get accounts(): Array<Account> {
        return this._accounts;
    }

    set accounts(value: Array<Account>) {
        this._accounts = value;
    }
}