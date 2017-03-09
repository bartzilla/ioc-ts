import * as express from "express";
import {Config} from "./server/src/config/Config";

var app = express();

let config = new Config();
config.wireDependencies();

app.listen(3000);
console.log('Example is running on port: 3000.');
