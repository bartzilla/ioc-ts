import {TenantDao} from "../TenantDao";
import {Tenant} from "../../../domain/Tenant";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class DefaultTenantDaoImpl implements TenantDao{
    save(tenant: Tenant): void {
        console.log('SAVE THE TENANT!!');
    }
}
