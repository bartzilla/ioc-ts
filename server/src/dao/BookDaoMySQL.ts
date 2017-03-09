import {BookDao} from "./BookDao";
import {Book} from "../model/Book";
import {injectable} from "inversify";

@injectable()
export class BookDaoMySQL implements BookDao
{
    public save(newBook: Book): void
    {
        console.log("Saving book: " + newBook + " using MySQL");
    }

}
