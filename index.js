"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Book_1 = require("./model/Book");
var service_types_1 = require("./service/types/service-types");
var inversify_config_1 = require("./inversify.config");
function startBookApp() {
    // Manually wire bookService and bookDao
    // let bookDao: BookDao = new BookDaoMySQL();
    var bookService = inversify_config_1.default.get(service_types_1.default.BookService);
    // Create a books
    var book = new Book_1.Book("1234", "100 anios de soledad", "Gabriel Garcia Marquez");
    bookService.registerNewBook(book);
}
startBookApp();
//# sourceMappingURL=index.js.map