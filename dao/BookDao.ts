import {Book} from "../model/Book";
export interface BookDao {
    save(newBook: Book): void
}
