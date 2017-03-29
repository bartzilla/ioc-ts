import {Schema} from "mongoose";
import {IApplication} from "../IApplication";
import {Model} from "mongoose";
import {model} from "mongoose";
import {ITenantModel} from "../../tenant/impl/TenantModel";

export interface IApplicationModel extends IApplication, Document {
    createApplication(tenant: ITenantModel, newApplication: IApplicationModel, callback): void;
}

export var ApplicationSchema: Schema = new Schema({
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
});

ApplicationSchema.methods.createApplication = function(tenant: ITenantModel, newApplication: IApplicationModel, callback: (err: Error | undefined, application?: IApplicationModel) => void): void{

    let app = new ApplicationModel();
    app._name = "TEST-APPLICATION";

    app.save(function (err) {
        if (err) return callback(undefined);

        tenant._applications.push(app._id);
        tenant.save();

        return callback(undefined, app);
    });

    return callback(undefined, newApplication);
};

export const ApplicationModel: Model<any> = model<any>("Application", ApplicationSchema);