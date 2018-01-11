"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const co_body_1 = require("co-body");
const formidable_1 = require("formidable");
const multipart = (ctx, { encoding = 'utf-8' } = {}) => {
    return new Promise((resolve, reject) => {
        const formidable = new formidable_1.IncomingForm();
        // 设置编码
        formidable.encoding = encoding;
        // 存放请求体
        const body = {};
        formidable.on('field', (field, value) => {
            if (body[field]) {
                if (Array.isArray(body[field])) {
                    body[field].push(value);
                }
                else {
                    body[field] = [body[field], value];
                }
            }
            else {
                body[field] = value;
            }
        }).on('file', (field, file) => {
            if (body[field]) {
                if (Array.isArray(body[field])) {
                    body[field].push(file);
                }
                else {
                    body[field] = [body[field], file];
                }
            }
            else {
                body[field] = file;
            }
        }).on('end', () => {
            return resolve(body);
        }).on('error', (err) => {
            return reject(err);
        });
        // 执行解析
        formidable.parse(ctx.req);
    });
};
exports.default = {
    json: co_body_1.json,
    multipart,
    text: co_body_1.text,
    urlencoded: co_body_1.form
};