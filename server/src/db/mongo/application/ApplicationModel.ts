import {Document, Schema, Model, model} from "mongoose";
import {Application} from "../../../domain/Application";
import {ITenantModel} from "../tenant/TenantModel";
import {Tenant} from "../../../domain/Tenant";

export interface IApplicationModel extends Application, Document {
    createApplication(tenant: Tenant, newApplication: IApplicationModel, callback: (err: Error | undefined, application?: IApplicationModel) => void): void;
    deleteApplication(applicationId: string, callback: (err: Error | undefined, appId?: string) => void): void
    findApplicationById(applicationId: string, callback:(err: Error | undefined, application?: IApplicationModel) => void, populateRefs?: boolean): void;
}

export var ApplicationSchema: Schema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    accounts: [{type: Schema.Types.ObjectId, ref: 'Account'}]
}, {versionKey: false});

ApplicationSchema.pre('remove', function(next) {

    let tenantModel = this.model('Tenant');
    let appId = this._id;

    this.model('Account').remove({_id: {$in: this.accounts }}, function(){

        tenantModel.update({ },
            { $pull: { applications: appId } },
            { multi: true }, next);
    });

});

ApplicationSchema.methods.createApplication = function(tenant: ITenantModel, newApplication: IApplicationModel, callback: (err: Error | undefined, application?: IApplicationModel) => void): void{

    newApplication.save(function (err) {
        if (err) return callback(err);

        tenant.applications.push(newApplication._id);
        tenant.save();

        return callback(undefined, newApplication);
    });

};

ApplicationSchema.methods.deleteApplication = function(applicationId: string, callback: (err: Error | undefined, appId?: string) => void): void{

    ApplicationModel.findOne({_id: applicationId}, function(err, app){
        if (err) return callback(err);

        app.remove(function(err) {
            if (err) return callback(err);

            return callback(undefined, applicationId);
        });
    });

};

ApplicationSchema.methods.findApplicationById = function(applicationId: string, callback: (err: Error | undefined, application?: IApplicationModel) => void, populateRefs?: boolean): void{

    if(populateRefs === true){
        ApplicationModel.findOne({_id: applicationId})
            .populate("accounts")
            .exec(function(dbErr, dbRes){
                if (dbErr) return callback(dbErr);

                return callback(undefined, dbRes);
            });
    } else {
        ApplicationModel.findOne({_id: applicationId},
            function(dbErr, dbRes){
                if (dbErr) return callback(dbErr);
                return callback(undefined, dbRes);
            }
        );
    }
};

export const ApplicationModel: Model<IApplicationModel> = model<IApplicationModel>("Application", ApplicationSchema);