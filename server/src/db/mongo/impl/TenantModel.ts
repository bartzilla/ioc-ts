import { Document, Schema, Model, model} from "mongoose";
import {ITenant} from "../ITenant";
import * as bcrypt from "bcrypt";

export interface ITenantModel extends ITenant, Document {
    createTenant(newTenant, callback): void;
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

TenantSchema.methods.createTenant = function(newTenant: ITenantModel, callback): void{
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newTenant._adminPassword, salt, function(err, hash) {
            newTenant._adminPassword = hash;
            newTenant.save(callback);
        });
    });
};

export const TenantModel: Model<ITenantModel> = model<ITenantModel>("Tenant", TenantSchema);