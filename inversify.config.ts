import {Container} from "inversify";
import DAO_TYPES from "./dao/types/dao-types";
import SERVICE_TYPES from "./service/types/service-types";
import {BookServiceImpl} from "./service/BookServiceImpl";
import {BookService} from "./service/BookService";
import {BookDao} from "./dao/BookDao";
import {BookDaoMongoImpl} from "./dao/BookDaoMongoImpl";

var container = new Container();
container.bind<BookDao>(DAO_TYPES.BookDao).to(BookDaoMongoImpl);
container.bind<BookService>(SERVICE_TYPES.BookService).to(BookServiceImpl);
// container.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);

export default container;