"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var dao_types_1 = require("./dao/types/dao-types");
var service_types_1 = require("./service/types/service-types");
var BookServiceImpl_1 = require("./service/BookServiceImpl");
var BookDaoMongoImpl_1 = require("./dao/BookDaoMongoImpl");
var container = new inversify_1.Container();
container.bind(dao_types_1.default.BookDao).to(BookDaoMongoImpl_1.BookDaoMongoImpl);
container.bind(service_types_1.default.BookService).to(BookServiceImpl_1.BookServiceImpl);
// container.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);
exports.default = container;
//# sourceMappingURL=inversify.config.js.map