import {Container} from "inversify";
import DAO_TYPES from "../daos/types/dao-types";
import SERVICE_TYPES from "../services/types/service-types";
import {TenantDao} from "../daos/tenant/TenantDao";
import {DefaultTenantDaoImpl} from "../daos/tenant/impl/DefaultTenantDaoImpl";
import {TenantService} from "../services/tenant/TenantService";
import {DefaultTenantServiceImpl} from "../services/tenant/impl/DefaultTenantServiceImpl";

var container = new Container();

container.bind<TenantDao>(DAO_TYPES.TenantDao).to(DefaultTenantDaoImpl);
container.bind<TenantService>(SERVICE_TYPES.TenantService).to(DefaultTenantServiceImpl);

export default container;