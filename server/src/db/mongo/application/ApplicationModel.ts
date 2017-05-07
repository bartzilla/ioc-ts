import {Document, Schema, Model, model} from "mongoose";
import {Application} from "../../../domain/Application";
import {ITenantModel} from "../tenant/TenantModel";

export interface IApplicationModel extends Application, Document {
    createApplication(tenant, newApplication: IApplicationModel, callback: (err: Error | undefined, application?: IApplicationModel) => void): void;
    deleteApplication(application: IApplicationModel, callback: (err: Error | undefined, response) => void): void
}

export var ApplicationSchema: Schema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    accounts: [{
        email: {
            type: String,
            lowercase: true,
            unique: true,
            sparse: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }]
}, {versionKey: false});

ApplicationSchema.methods.createApplication = function(tenant: ITenantModel, newApplication: IApplicationModel, callback: (err: Error | undefined, application?: IApplicationModel) => void): void{

    newApplication.save(function (err) {
        if (err) return callback(undefined);

        tenant.applications.push(newApplication._id);
        tenant.save();

        return callback(undefined, newApplication);
    });

};

ApplicationSchema.methods.deleteApplication = function(application: IApplicationModel, callback: (err: Error | undefined, response) => void): void{

    // application.remove({ _id: req.body.id }, function(err) {
    //     if (!err) {
    //         message.type = 'notification!';
    //     }
    //     else {
    //         message.type = 'error';
    //     }
    // });

};

export const ApplicationModel: Model<IApplicationModel> = model<IApplicationModel>("Application", ApplicationSchema);