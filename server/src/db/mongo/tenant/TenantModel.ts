import { Document, Schema, Model, model} from "mongoose";
import * as bcrypt from "bcrypt";
import {Tenant} from "../../../domain/Tenant";

export interface ITenantModel extends Tenant, Document {
    createTenant(newTenant, callback): void;
    findById(tenantId, callback): void;
    findTenantsByEmail(email: string, callback): void;
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
            console.log('[CREATE-TENANT] Error while while generating the salt for password', err);
            return callback(err);
        }

        bcrypt.hash(newTenant.adminPassword, salt, (err, hash) => {

            if(err) {
                console.log('[CREATE-TENANT] Error while while hashing password', err);
                return callback(err);
            }
            newTenant.adminPassword = hash;
            newTenant.save();

            return callback(undefined, newTenant);
        });
    });
};

TenantSchema.methods.findById = function(tenantId: string, callback: (err: Error | undefined, tenant?: ITenantModel) => void): void{

    TenantModel.findOne({_id: tenantId},
        function(dbErr, dbRes){
            if (dbErr) return callback(undefined);

            return callback(undefined, dbRes);
        }
    );

    // TenantModel.findOne({_id: tenantId},
    //     function(dbErr, dbRes){
    //
    //         if (dbErr) return callback(undefined);
    //
    //         let app = new ApplicationModel();
    //         app._name = "TEST-APPLICATION";
    //
    //         app.save(function (err) {
    //             if (err) return callback(undefined);
    //
    //             dbRes._applications.push(app._id);
    //             dbRes.save();
    //
    //             return callback(undefined, dbRes);
    //         });
    //     }
    // );

};


TenantSchema.methods.findTenantsByEmail = function(email: string, callback: (err: Error | undefined, tenant?: Tenant) => void): void{

    TenantModel.find({adminEmail: email}).lean()
        .populate("applications")
        .exec(function(dbErr, dbRes){
            if (dbErr) return callback(undefined);

            return callback(undefined, <Tenant> dbRes);
    });
};

export const TenantModel: Model<ITenantModel> = model<ITenantModel>("Tenant", TenantSchema);
