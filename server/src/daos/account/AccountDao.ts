import {Application} from "../../domain/Application";
import {Account} from "../../domain/Account";

export interface AccountDao {
    save(account: Account, callback: (error: Error, account?: Account) => void): void

    addApplication(application: Application, account: Account, callback: (error: Error, account?: Account) => void): void

    getAllAccountsForApplication(applicationId: string, callback: (error: Error, accounts?: Account[]) => void): void

    getAccountByEmail(email: string, callback: (error: Error, account?: Account) => void, populateRefs?: boolean): void

    getAccountById(accountId: string, callback: (error: Error, account?: Account) => void, populateRefs?: boolean): void

    deleteAccount(accountId: string, callback: (error: Error, response?) => void): void
}

