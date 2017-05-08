import {injectable} from "inversify";
import "reflect-metadata";
import {AccountDao} from "../AccountDao";
import {Application} from "../../../domain/Application";
import {AccountModel} from "../../../db/mongo/account/AccountModel"
import {Account} from "../../../domain/Account";
import {IApplicationModel} from "../../../db/mongo/application/ApplicationModel";

@injectable()
export class DefaultAccountDaoImpl implements AccountDao {
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