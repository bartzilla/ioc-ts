import {injectable} from "inversify";
import "reflect-metadata";
import {AccountDao} from "../AccountDao";
import {Application} from "../../../domain/Application";
import {AccountModel} from "../../../db/mongo/account/AccountModel"
import {ApplicationModel} from "../../../db/mongo/application/ApplicationModel"
import {Account} from "../../../domain/Account";

@injectable()
export class DefaultAccountDaoImpl implements AccountDao {

    save(account: Account, callback: (error: Error | undefined, account?: Account) => void): void {

        let newAccount = new AccountModel({email: account.email, password: account.password});

        newAccount.createAccount(newAccount, (err: Error, account: Account) => {
            if(err) {
                return callback(err);
            }
            else {
                console.log('Account successfully created: ', account);
                return callback(null, account);
            }
        });
    }

    getAccountByEmail(email: string, callback: (error: Error, account?: Account)=>void, populateRefs?: boolean): void {
        let accountModel = new AccountModel();

        accountModel.findAccountByEmail(email, (err: Error, account: Account) => {
            if(err) {
                return callback(err);
            }
            else {
                console.log('Account successfully retrieved: ', account);
                return callback(null, account);
            }
        }, populateRefs);
    }

    getAccountById(accountId: string, callback: (error: Error, account?: Account)=>void, populateRefs?: boolean): void {
        var account = new AccountModel();

        account.findAccountById(accountId, (err: Error, account: Account) => {
            if(err) {
                return callback(err);
            }
            else {
                console.log('Account successfully retrieved: ', account);
                return callback(null, account);
            }
        }, populateRefs);
    }

    deleteAccount(accountId: string, callback: (error: Error, response?)=>void): void {
        let account = new AccountModel();

        account.deleteAccount(accountId, (err: Error, accountId: string) => {
            if(err) {
                return callback(err);
            }
            else {
                console.log('Account successfully deleted: ', accountId);
                return callback(null, accountId);
            }
        });
    }

    getAllAccountsForApplication(applicationId: string, callback: (error: Error, accounts?: Account[])=>void): void {
        let application = new ApplicationModel();

        application.findApplicationById(applicationId, (err: Error, application: Application) => {
            if(err) {
                return callback(err);
            }
            else {
                // check if tenant has no apps. Undefined or null
                if (application == null) return callback(null, []);

                return callback(null, application.accounts);
            }
        }, true);

    }

    getAllAccountsForTenant(tenantId: string, callback: (error: Error, accounts?: Account[])=>void): void {
        let application = new AccountModel();

        application.getAccounts(applicationId, (err: Error, application: Application) => {
            if(err) {
                return callback(err);
            }
            else {
                // check if tenant has no apps. Undefined or null
                if (application == null) return callback(null, []);

                return callback(null, application.accounts);
            }
        }, true);

    }

    addApplication(application: Application, account: Account, callback: (error: Error, account?: Account)=>void): void {
        let accountModel = new AccountModel();

        accountModel.addApplication(application, account, (err: Error, account: Account) => {
            if(err) {
                return callback(err);
            }
            else {
                console.log('Application successfully added to account: ', account);
                return callback(null, account);
            }
        });
    }
}