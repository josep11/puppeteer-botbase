"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectArrayToCookieParamArray = exports.objectToCookieParam = exports.semiRandomiseViewPort = void 0;
const index_1 = require("./index");
function semiRandomiseViewPort(page, width, height) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.setViewport({
            width: width + index_1.helper.getRandBetween(1, 100),
            height: height + index_1.helper.getRandBetween(1, 100),
        });
    });
}
exports.semiRandomiseViewPort = semiRandomiseViewPort;
function objectToCookieParam(obj) {
    const newObj = obj;
    // The name and value properties are mandatory
    if (!newObj.name || !newObj.value) {
        throw new Error("Missing mandatory properties");
    }
    // If all properties are present, cast to CookieParam and return
    return newObj;
}
exports.objectToCookieParam = objectToCookieParam;
function objectArrayToCookieParamArray(cookies) {
    const cookiesValidated = [];
    for (const cookie of cookies) {
        cookiesValidated.push(objectToCookieParam(cookie));
    }
    return cookiesValidated;
}
exports.objectArrayToCookieParamArray = objectArrayToCookieParamArray;
