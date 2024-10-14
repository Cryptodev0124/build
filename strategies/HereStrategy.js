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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HereStrategy = exports.getRequest = exports.proxyApi = exports.deleteRequest = exports.getResponse = exports.createRequest = void 0;
const types_1 = require("../types");
const proxyMethods_1 = require("../helpers/proxyMethods");
Object.defineProperty(exports, "createRequest", { enumerable: true, get: function () { return proxyMethods_1.createRequest; } });
Object.defineProperty(exports, "getResponse", { enumerable: true, get: function () { return proxyMethods_1.getResponse; } });
Object.defineProperty(exports, "deleteRequest", { enumerable: true, get: function () { return proxyMethods_1.deleteRequest; } });
Object.defineProperty(exports, "proxyApi", { enumerable: true, get: function () { return proxyMethods_1.proxyApi; } });
Object.defineProperty(exports, "getRequest", { enumerable: true, get: function () { return proxyMethods_1.getRequest; } });
class HereStrategy {
    connect(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            this.wallet = wallet;
        });
    }
    onInitialized() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onRequested(id, request, reject) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onApproving(result) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onSuccess(result) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onFailed(result) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    request(conf) {
        return __awaiter(this, void 0, void 0, function* () {
            let { request, disableCleanupRequest, id, signal } = conf, delegate = __rest(conf, ["request", "disableCleanupRequest", "id", "signal"]);
            if (id != null)
                request = yield (0, proxyMethods_1.getRequest)(id, signal);
            else
                id = yield (0, proxyMethods_1.createRequest)(request, signal);
            return new Promise((resolve, reject) => {
                let fallbackHttpTimer = null;
                const clear = () => __awaiter(this, void 0, void 0, function* () {
                    fallbackHttpTimer = -1;
                    clearInterval(fallbackHttpTimer);
                    if (disableCleanupRequest !== true) {
                        yield (0, proxyMethods_1.deleteRequest)(id);
                    }
                });
                const processApprove = (data) => {
                    switch (data.status) {
                        case types_1.HereProviderStatus.APPROVING:
                            this.onApproving(data);
                            return;
                        case types_1.HereProviderStatus.FAILED:
                            clear();
                            reject(new types_1.HereProviderError(data.payload));
                            this.onFailed(data);
                            return;
                        case types_1.HereProviderStatus.SUCCESS:
                            clear();
                            resolve(data);
                            this.onSuccess(data);
                            return;
                    }
                };
                const rejectAction = (payload) => {
                    var _a;
                    processApprove({
                        type: ((_a = request.selector) === null || _a === void 0 ? void 0 : _a.type) || "web",
                        status: types_1.HereProviderStatus.FAILED,
                        payload,
                    });
                };
                this.onRequested(id, request, rejectAction);
                signal === null || signal === void 0 ? void 0 : signal.addEventListener("abort", () => rejectAction());
                const setupTimer = () => {
                    if (fallbackHttpTimer === -1) {
                        return;
                    }
                    fallbackHttpTimer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        try {
                            const data = yield (0, proxyMethods_1.getResponse)(id);
                            if (fallbackHttpTimer === -1)
                                return;
                            processApprove(data);
                            setupTimer();
                        }
                        catch (e) {
                            const status = types_1.HereProviderStatus.FAILED;
                            const error = e instanceof Error ? e : undefined;
                            const payload = error === null || error === void 0 ? void 0 : error.message;
                            clear();
                            reject(new types_1.HereProviderError(payload, error));
                            this.onFailed({ type: ((_a = request.selector) === null || _a === void 0 ? void 0 : _a.type) || "web", status, payload });
                        }
                    }), 3000);
                };
                setupTimer();
            });
        });
    }
}
exports.HereStrategy = HereStrategy;
//# sourceMappingURL=HereStrategy.js.map