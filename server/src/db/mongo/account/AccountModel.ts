import {Document, Schema, Model, model} from "mongoose";
import {Account} from "../../../domain/Account";
import {IApplicationModel} from "../application/ApplicationModel";
import {Application} from "../../../domain/Application";
import * as bcrypt from "bcryptjs";

export interface IAccountModel extends Account, Document {
    createAccount(application: Application, newAccount: IAccountModel, callback: (err: Error | undefined, account?: IAccountModel) => void): void;
    // deleteApplication(applicationId: string, callback: (err: Error | undefined, appId?: string) => void): void
    // findApplicationById(applicationId: string, callback:(err: Error | undefined, application?: IApplicationModel) => void, populateRefs?: boolean): void;
}

export var AccountSchema: Schema = new Schema({
    email: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
}, {versionKey: false});


AccountSchema.methods.createAccount = function(application: IApplicationModel, newAccount: IAccountModel, callback: (err: Error | undefined, account?: IAccountModel) => void): void{

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

            newAccount.save(function (err) {
                if (err) return callback(err);

                application.accounts.push(newAccount._id);
                application.save();

                return callback(undefined, newAccount);
            });
        });
    });

};

AccountSchema.methods.deleteApplication = function(applicationId: string, callback: (err: Error | undefined, appId?: string) => void): void{

    // AccountSchema.findOne({_id: applicationId}, function(err, app){
    //     if (err) return callback(undefined);
    //
    //     app.remove(function(err) {
    //         if (err) return callback(undefined);
    //
    //         return callback(undefined, applicationId);
    //     });
    // });

};

export const AccountModel: Model<IAccountModel> = model<IAccountModel>("Account", AccountSchema);