import { Document, Schema, Model, model} from "mongoose";
import * as bcrypt from "bcryptjs";
import {Tenant} from "../../../domain/Tenant";

export interface ITenantModel extends Tenant, Document {
    createTenant(newTenant: ITenantModel, callback: (err: Error | undefined, tenant?: ITenantModel) => void): void;
    findTenantById(tenantId: string, callback:(err: Error | undefined, tenant?: ITenantModel) => void, populateRefs?: boolean): void;
    findTenantsByEmail(email: string, callback:(err: Error | undefined, tenant?: ITenantModel[]) => void, populateRefs?: boolean): void;
    comparePasswords(candidatePassword: string, hash: string, callback:(err: Error | undefined, tenant?: ITenantModel[]) => void): void;
}

export var TenantSchema: Schema = new Schema({
    tenantName: {
        type: String,
        unique: true,
        required: true
    },
    adminEmail: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    adminPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Client', 'Manager', 'Admin'],
        default: 'Client'
    },
    applications:[{type: Schema.Types.ObjectId, ref: 'Application'}]
}, {versionKey: false});

TenantSchema.methods.createTenant = function(newTenant: ITenantModel, callback: (err: Error | undefined, tenant?: ITenantModel) => void): void{
    bcrypt.genSalt(10, (err, salt) => {

        if(err) {
            console.log('[CREATE-TENANT] Error while generating the salt for password', err);
            return callback(err);
        }

        bcrypt.hash(newTenant.adminPassword, salt, (err, hash) => {

            if(err) {
                console.log('[CREATE-TENANT] Error while hashing password', err);
                return callback(err);
            }
            newTenant.adminPassword = hash;
            newTenant.save();

            return callback(undefined, newTenant);
        });
    });
};

TenantSchema.methods.findTenantById = function(tenantId: string, callback: (err: Error | undefined, tenant?: ITenantModel) => void, populateRefs?: boolean): void{

    if(populateRefs === true){
        TenantModel.findOne({_id: tenantId})
            .populate("applications")
            .exec(function(dbErr, dbRes){
                if (dbErr) return callback(undefined);

                return callback(undefined, dbRes);
            });
    } else {
        TenantModel.findOne({_id: tenantId},
            function(dbErr, dbRes){
                if (dbErr) return callback(undefined);
                return callback(undefined, dbRes);
            }
        );
    }
};

TenantSchema.methods.findTenantsByEmail = function(email: string, callback: (err: Error | undefined, tenant?: ITenantModel[]) => void, populateRefs?: boolean): void{

    if(populateRefs === true){
        TenantModel.find({adminEmail: email})
            .populate("applications")
            .exec(function(dbErr, dbRes){
                if (dbErr) return callback(undefined);

                return callback(undefined, dbRes);
            });
    } else {
        TenantModel.find({adminEmail: email},
            function(dbErr, dbRes){
                if (dbErr) return callback(undefined);
                return callback(undefined, dbRes);
            }
        );
    }
};

TenantSchema.methods.comparePasswords =  function(candidatePassword: string, hash: string , callback: (err: Error | undefined, tenant?: ITenantModel[]) => void): void{
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
};

export const TenantModel: Model<ITenantModel> = model<ITenantModel>("Tenant", TenantSchema);
