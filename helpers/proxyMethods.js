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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequest = exports.computeRequestId = exports.deleteRequest = exports.getResponse = exports.getRequest = exports.proxyApi = void 0;
const sha1_1 = __importDefault(require("sha1"));
const uuid4_1 = __importDefault(require("uuid4"));
const utils_1 = require("@near-js/utils");
const utils_2 = require("./utils");
exports.proxyApi = "https://h4n.app";
const getRequest = (id, signal) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`${exports.proxyApi}/${id}/request`, {
        signal,
        headers: { "content-type": "application/json" },
        method: "GET",
    });
    if (res.ok === false) {
        throw Error(yield res.text());
    }
    const { data } = yield res.json();
    return JSON.parse(Buffer.from((0, utils_1.baseDecode)(data)).toString("utf8"));
});
exports.getRequest = getRequest;
const getResponse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const res = yield fetch(`${exports.proxyApi}/${id}/response`, {
        headers: { "content-type": "application/json" },
        method: "GET",
    });
    if (res.ok === false) {
        throw Error(yield res.text());
    }
    const { data } = yield res.json();
    const result = (_a = JSON.parse(data)) !== null && _a !== void 0 ? _a : {};
    return Object.assign({ type: "here", public_key: "", account_id: "", payload: "", status: -1, path: "" }, result);
});
exports.getResponse = getResponse;
const deleteRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`${exports.proxyApi}/${id}`, {
        headers: { "content-type": "application/json" },
        method: "DELETE",
    });
    if (res.ok === false) {
        throw Error(yield res.text());
    }
});
exports.deleteRequest = deleteRequest;
const computeRequestId = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, utils_1.baseEncode)(JSON.stringify(Object.assign(Object.assign({}, request), { _id: (0, uuid4_1.default)() })));
    const hashsum = (0, sha1_1.default)(query);
    const id = Buffer.from(hashsum, "hex").toString("base64");
    const requestId = id.replaceAll("/", "_").replaceAll("-", "+").slice(0, 13);
    return { requestId, query };
});
exports.computeRequestId = computeRequestId;
const createRequest = (request, signal) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, requestId } = yield (0, exports.computeRequestId)(request);
    const res = yield fetch(`${exports.proxyApi}/${requestId}/request`, {
        method: "POST",
        body: JSON.stringify({ topic_id: (0, utils_2.getDeviceId)(), data: query }),
        headers: { "content-type": "application/json" },
        signal,
    });
    if (res.ok === false) {
        throw Error(yield res.text());
    }
    return requestId;
});
exports.createRequest = createRequest;
//# sourceMappingURL=proxyMethods.js.map