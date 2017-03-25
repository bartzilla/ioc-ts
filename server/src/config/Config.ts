import * as mongoose from "mongoose";

export class Config {

    public static connectMongo(): void {
        mongoose.connect('mongodb://localhost/ioc-ts');
    }
}
