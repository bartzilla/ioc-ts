"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Config_1 = require("./server/src/config/Config");
var app = express();
Config_1.Config.wireDependencies();
app.listen(3000, function () {
    console.log('Server running on port: 3000.');
});
//# sourceMappingURL=index.js.map