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
exports.StateStorage = void 0;
const mockStorage = {
    getItem(k) {
        return null;
    },
    setItem(k, v) { },
    removeItem(k) { },
};
class StateStorage {
    constructor() {
        this.dataKey = `herewallet:keystore`;
        this.storage = typeof window !== "undefined" ? window.localStorage : mockStorage;
    }
    setState(network, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getFullState();
            data[network] = state;
            this.storage.setItem(this.dataKey, JSON.stringify(data));
        });
    }
    getFullState() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return JSON.parse(this.storage.getItem(this.dataKey)) || {};
            }
            catch (_a) {
                return {};
            }
        });
    }
    getState(network) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.getFullState();
            return json[network] || { activeAccount: null, accounts: {} };
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.storage.removeItem(this.dataKey);
        });
    }
}
exports.StateStorage = StateStorage;
//# sourceMappingURL=JSONStorage.js.map