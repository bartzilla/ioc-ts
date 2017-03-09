"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Config_1 = require("./server/src/config/Config");
var app = express();
var config = new Config_1.Config();
config.wireDependencies();
app.listen(3000);
console.log('Example is running on port: 3000.');
//# sourceMappingURL=index.js.map