import {Document, Schema, Model, model} from "mongoose";
import {Account} from "../../../domain/Account";
import {IApplicationModel} from "../application/ApplicationModel";
import {Application} from "../../../domain/Application";
import * as bcrypt from "bcryptjs";

export interface IAccountModel extends Account, Document {
    createAccount(newAccount: IAccountModel, callback: (err: Error | undefined, account?: IAccountModel) => void): void;
    addApplication(application: Application, account: Account, callback: (err: Error | undefined, account?: Account) => void): void
    deleteAccount(accountId: string, callback: (err: Error | undefined, accountId?: string) => void): void
    findAccountByEmail(email: string, callback:(err: Error | undefined, account?: IAccountModel) => void, populateRefs?: boolean): void;
    findAccountById(accountId: string, callback:(err: Error | undefined, account?: IAccountModel) => void, populateRefs?: boolean): void;
}

export var AccountSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    applications:[{type: Schema.Types.ObjectId, ref: 'Application'}]
}, {versionKey: false});

AccountSchema.pre('remove', function(next) {
    this.model('Application').update({ },
        { "$pull": { "accounts": this._id } },
        { "multi": true }, next);
});

AccountSchema.methods.findAccountByEmail = function(email: string, callback: (err: Error | undefined, account?: IAccountModel) => void, populateRefs?: boolean): void{

    if(populateRefs === true){
        AccountModel.findOne({email: email})
            .populate("applications")
            .exec(function(dbErr, dbRes){
                if (dbErr) return callback(dbErr);

                return callback(undefined, dbRes);
            });
    } else {
        AccountModel.findOne({email: email},
            function(dbErr, dbRes){
                if (dbErr) return callback(dbErr);
                return callback(undefined, dbRes);
            }
        );
    }
};

AccountSchema.methods.findAccountById = function(accountId: string, callback:(err: Error | undefined, account?: IAccountModel) => void, populateRefs?: boolean): void {
    if(populateRefs === true){
        AccountModel.findOne({_id: accountId})
            .populate("applications")
            .exec(function(dbErr, dbRes){
                if (dbErr) return callback(dbErr);

                return callback(undefined, dbRes);
            });
    } else {
        AccountModel.findOne({_id: accountId},
            function(dbErr, dbRes){
                if (dbErr) return callback(dbErr);
                return callback(undefined, dbRes);
            }
        );
    }
};

AccountSchema.methods.createAccount = function(newAccount: IAccountModel, callback: (err: Error | undefined, account?: IAccountModel) => void): void{

    bcrypt.genSalt(10, (err, salt) => {

        if(err) {
            console.log('[CREATE-ACCOUNT] Error while generating the salt for password', err);
            return callback(err);
        }

        bcrypt.hash(newAccount.password, salt, (err, hash) => {

            if(err) {
                console.log('[CREATE-ACCOUNT] Error while hashing password', err);
                return callback(err);
            }
            newAccount.password = hash;

            if(err) return callback(err);

            newAccount.save(function(err){
                if (err) return callback(err);
                return callback(undefined, newAccount);
            });
        });
    });
};


AccountSchema.methods.addApplication = function(application: IApplicationModel, account: IAccountModel, callback: (err: Error | undefined, accounts?: Account) => void): void{

    if(account.applications.indexOf(application._id) <= -1) {
        account.applications.push(application._id);
    }

    account.save(function(err) {
        if (err) return callback(err);

        return callback(undefined, account)
    });
};

AccountSchema.methods.deleteAccount = function(accountId: string, callback: (err: Error | undefined, accountId?: string) => void): void{

    AccountModel.findOne({_id: accountId}, function(err, app){
        if (err) return callback(err);

        app.remove(function(err) {
            if (err) return callback(err);

            return callback(undefined, accountId);
        });
    });

};

export const AccountModel: Model<IAccountModel> = model<IAccountModel>("Account", AccountSchema);