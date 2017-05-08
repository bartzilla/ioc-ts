import {Application} from "../../domain/Application";
import {Account} from "../../domain/Account";

export interface AccountDao {
    save(applicationId: Application, account: Account, callback: (error: Error, account?: Account) => void): void
}

