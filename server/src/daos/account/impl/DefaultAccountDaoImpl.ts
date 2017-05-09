import {injectable} from "inversify";
import "reflect-metadata";
import {AccountDao} from "../AccountDao";
import {Application} from "../../../domain/Application";
import {AccountModel} from "../../../db/mongo/account/AccountModel"
import {ApplicationModel} from "../../../db/mongo/application/ApplicationModel"
import {Account} from "../../../domain/Account";

@injectable()
export class DefaultAccountDaoImpl implements AccountDao {

    deleteAccount(accountId: string, callback: (error: Error, response)=>void): void {
        let account = new AccountModel();

        account.deleteAccount(accountId, (err: Error, accountId: string) => {
            if(err) {
                throw err;
            }
            else {
                console.log('Account successfully deleted: ', accountId);
                return callback(null, accountId);
            }
        });
    }

    getAllAccountsForApplication(applicationId: string, callback: (error: Error, applications?: Account[])=>void): void {
        let application = new ApplicationModel();

        application.findApplicationById(applicationId, (err: Error, application: Application) => {
            if(err) {
                throw err;
            }
            else {
                // check if tenant has no apps. Undefined or null
                if (application == null) return callback(null, []);

                return callback(null, application.accounts);
            }
        }, true);

    }
    save(application: Application, account: Account, callback: (error: Error, account?: Account)=>void): void {
        let newAccount = new AccountModel({email: account.email, password: account.password});

        newAccount.createAccount(application, newAccount, (err: Error, account: Account) => {
            if(err) {
                throw err;
            }
            else {
                console.log('Account successfully created: ', account);
                return callback(null, account);
            }
        });
    }
}