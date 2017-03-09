import * as express from "express";
import {Config} from "./server/src/config/Config";

var app = express();

Config.wireDependencies();

app.listen(3000, () => {
    console.log('Server running on port: 3000.');
});

