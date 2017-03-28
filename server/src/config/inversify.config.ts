import {Container} from "inversify";
import DAO_TYPES from "../daos/types/dao-types";
import SERVICE_TYPES from "../services/types/service-types";
import {TenantDao} from "../daos/tenant/TenantDao";
import {DefaultTenantDaoImpl} from "../daos/tenant/impl/DefaultTenantDaoImpl";
import {TenantService} from "../services/tenant/TenantService";
import {DefaultTenantServiceImpl} from "../services/tenant/impl/DefaultTenantServiceImpl";
import {ApplicationDao} from "../daos/application/ApplicationDao";
import {DefaultApplicationDaoImpl} from "../daos/application/impl/DefaultApplicationDaoImpl";
import {ApplicationService} from "../services/application/ApplicationService";
import {DefaultApplicationServiceImpl} from "../services/application/impl/DefaultApplicationServiceImpl";

var container = new Container();

container.bind<TenantDao>(DAO_TYPES.TenantDao).to(DefaultTenantDaoImpl);
container.bind<TenantService>(SERVICE_TYPES.TenantService).to(DefaultTenantServiceImpl);

container.bind<ApplicationDao>(DAO_TYPES.ApplicationDao).to(DefaultApplicationDaoImpl);
container.bind<ApplicationService>(SERVICE_TYPES.ApplicationService).to(DefaultApplicationServiceImpl);

export default container;