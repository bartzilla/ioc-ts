import {BookDao} from "./BookDao";
import {Book} from "../model/Book";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class BookDaoMongoImpl implements BookDao
{
    public save(newBook: Book): void
    {
        console.log("Saving book: " + newBook + " using Mongo database");
    }

}
