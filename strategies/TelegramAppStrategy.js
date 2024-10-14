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
exports.TelegramAppStrategy = void 0;
const crypto_1 = require("@near-js/crypto");
const utils_1 = require("@near-js/utils");
const types_1 = require("../types");
const proxyMethods_1 = require("../helpers/proxyMethods");
const HereStrategy_1 = require("./HereStrategy");
const utils_2 = require("../helpers/utils");
class TelegramAppStrategy extends HereStrategy_1.HereStrategy {
    constructor(appId = "herewalletbot/app", walletId = "herewalletbot/app") {
        super();
        this.appId = appId;
        this.walletId = walletId;
    }
    connect(wallet) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof window === "undefined")
                return;
            this.wallet = wallet;
            const startapp = ((_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.Telegram) === null || _a === void 0 ? void 0 : _a.WebApp) === null || _b === void 0 ? void 0 : _b.initDataUnsafe) === null || _c === void 0 ? void 0 : _c.start_param) || "";
            (_f = (_d = window === null || window === void 0 ? void 0 : window.Telegram) === null || _d === void 0 ? void 0 : (_e = _d.WebApp).ready) === null || _f === void 0 ? void 0 : _f.call(_e);
            if (startapp.startsWith("hot")) {
                let requestId = startapp.split("-").pop() || "";
                requestId = Buffer.from((0, utils_1.baseDecode)(requestId)).toString("utf8");
                const requestPending = localStorage.getItem(`__telegramPendings:${requestId}`);
                if (requestPending == null)
                    return;
                const data = yield (0, HereStrategy_1.getResponse)(requestId);
                if (data.status !== types_1.HereProviderStatus.SUCCESS) {
                    localStorage.removeItem(`__telegramPendings:${requestId}`);
                    return;
                }
                if (data.type === "sign") {
                    yield this.wallet.authStorage.setKey("mainnet", data.account_id, crypto_1.KeyPairEd25519.fromRandom());
                    yield this.wallet.authStorage.setActiveAccount("mainnet", data.account_id);
                }
                try {
                    const pending = JSON.parse(requestPending);
                    if (pending.privateKey) {
                        yield this.wallet.authStorage.setKey("mainnet", data.account_id, crypto_1.KeyPair.fromString(pending.privateKey));
                        yield this.wallet.authStorage.setActiveAccount("mainnet", data.account_id);
                    }
                    const url = new URL(location.origin + (pending.callbackUrl || ""));
                    url.searchParams.set("payload", data.result);
                    localStorage.removeItem(`__telegramPendings:${requestId}`);
                    location.assign(url.toString());
                }
                catch (e) {
                    const url = new URL(location.href);
                    url.searchParams.set("payload", data.result);
                    localStorage.removeItem(`__telegramPendings:${requestId}`);
                    location.assign(url.toString());
                }
            }
        });
    }
    request(conf) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof window === "undefined")
                return;
            conf.request.telegramApp = this.appId;
            conf.request.callbackUrl = "";
            const { requestId, query } = yield (0, proxyMethods_1.computeRequestId)(conf.request);
            const res = yield fetch(`${proxyMethods_1.proxyApi}/${requestId}/request`, {
                method: "POST",
                body: JSON.stringify({ topic_id: (0, utils_2.getDeviceId)(), data: query }),
                headers: { "content-type": "application/json" },
                signal: conf.signal,
            });
            if (res.ok === false) {
                throw Error(yield res.text());
            }
            localStorage.setItem(`__telegramPendings:${requestId}`, JSON.stringify({ callbackUrl: conf.callbackUrl, privateKey: (_a = conf.accessKey) === null || _a === void 0 ? void 0 : _a.toString() }));
            this.onRequested(requestId);
        });
    }
    onRequested(id) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof window === "undefined")
                return;
            id = (0, utils_1.baseEncode)(id);
            (_b = (_a = window === null || window === void 0 ? void 0 : window.Telegram) === null || _a === void 0 ? void 0 : _a.WebApp) === null || _b === void 0 ? void 0 : _b.openTelegramLink(`https://t.me/${this.walletId}?startapp=h4n-${id}`);
            (_d = (_c = window === null || window === void 0 ? void 0 : window.Telegram) === null || _c === void 0 ? void 0 : _c.WebApp) === null || _d === void 0 ? void 0 : _d.close();
        });
    }
}
exports.TelegramAppStrategy = TelegramAppStrategy;
//# sourceMappingURL=TelegramAppStrategy.js.map