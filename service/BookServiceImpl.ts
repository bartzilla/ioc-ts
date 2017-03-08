import {BookService} from "./BookService";
import {Book} from "../model/Book";
import {BookDao} from "../dao/BookDao";
import "reflect-metadata";
import DAO_TYPES from "../dao/types/dao-types";
import {inject, injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class BookServiceImpl implements BookService
{
    @inject(DAO_TYPES.BookDao)
    private bookDao: BookDao;

    public registerNewBook(newBook: Book): void
    {
        this.bookDao.save(newBook);
    }

}
