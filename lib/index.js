"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
exports.default = ({ encoding = 'utf-8', // 编码
    error = false, // 解析错误回调
    json = true, // 支持json解析
    multipart = true, // 支持form-data解析
    text = true, // 支持text解析
    urlencoded = true // 支持urlencoded解析
     } = {}) => {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        // 已经被解析过的情况
        if (ctx.request.body !== undefined) {
            return yield next();
        }
        try {
            // 存放请求体
            let body = {};
            if (json && ctx.is('json')) {
                body = yield parser_1.default.json(ctx, { encoding });
            }
            else if (urlencoded && ctx.is('urlencoded')) {
                body = yield parser_1.default.urlencoded(ctx, { encoding });
            }
            else if (text && ctx.is('text')) {
                body = yield parser_1.default.text(ctx, { encoding });
            }
            else if (multipart && ctx.is('multipart')) {
                body = yield parser_1.default.multipart(ctx, { encoding });
            }
            if (Object.keys(body).length) {
                ctx.request.body = body;
            }
        }
        catch (err) {
            if (typeof error === 'function') {
                error(err, ctx);
            }
            else {
                throw err;
            }
        }
        return yield next();
    });
};
