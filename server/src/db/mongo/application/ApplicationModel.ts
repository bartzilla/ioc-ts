import {Schema, Model, model} from "mongoose";
import {Application} from "../../../domain/Application";

export interface IApplicationModel extends Application, Document {
    createApplication(tenant, newApplication: IApplicationModel, callback): void;
}

export var ApplicationSchema: Schema = new Schema({
    name: {
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

ApplicationSchema.methods.createApplication = function(tenant, newApplication, callback: (err: Error | undefined, application?: IApplicationModel) => void): void{

    newApplication.save(function (err) {
        if (err) return callback(undefined);

        tenant.applications.push(newApplication._id);
        tenant.save();

        return callback(undefined, newApplication);
    });

};

export const ApplicationModel: Model<any> = model<any>("Application", ApplicationSchema);