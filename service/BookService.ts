import {Book} from "../model/Book";

export interface BookService {
    registerNewBook(newBook: Book): void;
}