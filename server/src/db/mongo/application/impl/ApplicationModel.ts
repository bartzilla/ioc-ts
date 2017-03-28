import {Schema} from "mongoose";
import {IApplication} from "../IApplication";
import {Model} from "mongoose";
import {model} from "mongoose";

export interface IApplicationModel extends IApplication, Document {
    createApplication(newApplication: IApplicationModel, callback): void;
}

export var ApplicationSchema: Schema = new Schema({
    _applications:[{
        _name: {
            type: String
        },
        _accounts: [{
            _email: {
                type: String,
                lowercase: true,
                unique: true,
                sparse: true,
                required: true
            },
            _password: {
                type: String,
                required: true
            }
        }]
    }]
});

export const ApplicationModel: Model<any> = model<any>("Application", ApplicationSchema);

ApplicationSchema.methods.createApplication = function(newApplication: IApplicationModel, callback: (err: Error | undefined, application?: IApplicationModel) => void): void{
    return callback(undefined, newApplication);
};