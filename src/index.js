"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.Lifetime = exports.getInstance = exports.InjectInstance = exports.Inject = exports.configureDI = void 0;
var annotation_1 = require("./annotation");
__createBinding(exports, annotation_1, "configureDI");
__createBinding(exports, annotation_1, "Inject");
__createBinding(exports, annotation_1, "InjectInstance");
var solver_1 = require("./solver");
__createBinding(exports, solver_1, "getInstance");
var util_1 = require("./util");
__createBinding(exports, util_1, "Lifetime");
