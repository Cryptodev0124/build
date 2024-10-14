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
exports.InjectedStrategy = void 0;
const uuid4_1 = __importDefault(require("uuid4"));
const crypto_1 = require("@near-js/crypto");
const types_1 = require("../types");
const waitInjected_1 = require("../helpers/waitInjected");
const HereStrategy_1 = require("./HereStrategy");
class InjectedStrategy extends HereStrategy_1.HereStrategy {
    connect(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof window === "undefined")
                return Promise.resolve();
            this.wallet = wallet;
            const injected = yield waitInjected_1.waitInjectedHereWallet;
            if (injected == null)
                return;
            yield this.wallet.authStorage.setKey(injected.network, injected.accountId, crypto_1.KeyPairEd25519.fromRandom());
            yield this.wallet.authStorage.setActiveAccount(injected.network, injected.accountId);
        });
    }
    request(conf) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof window === "undefined")
                return Promise.reject("SSR");
            return new Promise((resolve) => {
                const id = (0, uuid4_1.default)();
                const handler = (e) => {
                    if (e.data.id !== id)
                        return;
                    if (e.data.status === types_1.HereProviderStatus.SUCCESS || e.data.status === types_1.HereProviderStatus.FAILED) {
                        window === null || window === void 0 ? void 0 : window.removeEventListener("message", handler);
                        return resolve(e.data);
                    }
                };
                window === null || window === void 0 ? void 0 : window.parent.postMessage(Object.assign(Object.assign({ $here: true }, conf.request), { id }), "*");
                window === null || window === void 0 ? void 0 : window.addEventListener("message", handler);
            });
        });
    }
}
exports.InjectedStrategy = InjectedStrategy;
//# sourceMappingURL=InjectedStrategy.js.map