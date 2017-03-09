import {BookService} from "../service/BookService";
import {Book} from "../model/Book";
import SERVICE_TYPES from "../service/types/service-types";
import container from "./inversify.config";

export class Config {

    public wireDependencies(): void {
        // Manually wire bookService and bookDao
        // let bookDao: BookDao = new BookDaoMySQL();
        let bookService = container.get<BookService>(SERVICE_TYPES.BookService);

        // Create a books
        let book: Book = new Book("1234", "100 anios de soledad", "Gabriel Garcia Marquez");

        bookService.registerNewBook(book);
    }
}
