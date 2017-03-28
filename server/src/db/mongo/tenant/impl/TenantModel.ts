import { Document, Schema, Model, model} from "mongoose";
import {ITenant} from "../ITenant";
import * as bcrypt from "bcrypt";

export interface ITenantModel extends ITenant, Document {
    createTenant(newTenant, callback): void;
    findById(tenantId, callback): void
}

export var TenantSchema: Schema = new Schema({
    _tenantName: {
        type: String,
        unique: true,
        required: true
    },
    _adminEmail: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    _adminPassword: {
        type: String,
        required: true
    },
    _role: {
        type: String,
        enum: ['Client', 'Manager', 'Admin'],
        default: 'Client'
    },
    _applications:[{type: Schema.Types.ObjectId, ref: 'Application'}]
});

TenantSchema.methods.createTenant = function(newTenant: ITenantModel, callback: (err: Error | undefined, tenant?: ITenantModel) => void): void{
    bcrypt.genSalt(10, (err, salt) => {

        if(err) {
            console.log('[CREATE-TENANT] Error while while generating the salt for passowrd', err);
            return callback(err);
        }

        bcrypt.hash(newTenant._adminPassword, salt, (err, hash) => {

            if(err) {
                console.log('[CREATE-TENANT] Error while while hashing passowrd', err);
                return callback(err);
            }
            newTenant._adminPassword = hash;
            newTenant.save();

            return callback(undefined, newTenant);
        });
    });
};

TenantSchema.methods.findById = function(tenantId: string, callback: (err: Error | undefined, tenant?: ITenantModel) => void): void{


    TenantModel.findOne(
        {
            _id: tenantId
        },
        function(dbErr, dbRes){
            console.log("Okay lets get that shit!! ", dbRes);

        });

    return callback(undefined, null);
};

export const TenantModel: Model<ITenantModel> = model<ITenantModel>("Tenant", TenantSchema);