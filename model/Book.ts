export class Book{
    private isbn: string;
    private title: string;
    private author: string;

    constructor(isbn: string, title: string, author: string)
    {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
    }
}
