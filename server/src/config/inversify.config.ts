import {Container} from "inversify";
import DAO_TYPES from "../daos/types/dao-types";
import {TenantDao} from "../daos/tenant/TenantDao";
import {DefaultTenantDaoImpl} from "../daos/tenant/impl/DefaultTenantDaoImpl";
import {ApplicationDao} from "../daos/application/ApplicationDao";
import {DefaultApplicationDaoImpl} from "../daos/application/impl/DefaultApplicationDaoImpl";
import {AccountDao} from "../daos/account/AccountDao";
import {DefaultAccountDaoImpl} from "../daos/account/impl/DefaultAccountDaoImpl";

var container = new Container();

container.bind<TenantDao>(DAO_TYPES.TenantDao).to(DefaultTenantDaoImpl);
container.bind<ApplicationDao>(DAO_TYPES.ApplicationDao).to(DefaultApplicationDaoImpl);
container.bind<AccountDao>(DAO_TYPES.AccountDao).to(DefaultAccountDaoImpl);

export default container;