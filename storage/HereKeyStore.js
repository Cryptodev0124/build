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
exports.HereKeyStore = void 0;
const crypto_1 = require("@near-js/crypto");
const JSONStorage_1 = require("./JSONStorage");
class HereKeyStore {
    constructor(storage = new JSONStorage_1.StateStorage()) {
        this.storage = storage;
    }
    setActiveAccount(network, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.storage.getState(network);
            state.activeAccount = id;
            this.storage.setState(network, state);
        });
    }
    setKey(networkId, accountId, keyPair) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.storage.getState(networkId);
            state.accounts[accountId] = keyPair.toString();
            this.storage.setState(networkId, state);
        });
    }
    getAccounts(network) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.storage.getState(network);
            return Object.keys(state.accounts);
        });
    }
    getActiveAccount(network) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.storage.getState(network);
            return state.activeAccount;
        });
    }
    getKey(networkId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.storage.getState(networkId);
            const privateKey = state.accounts[accountId];
            if (privateKey == null)
                throw Error(`For ${accountId} in ${networkId} network key not found`);
            const keyPair = crypto_1.KeyPair.fromString(privateKey);
            return keyPair;
        });
    }
    removeKey(networkId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            let state = yield this.storage.getState(networkId);
            if (state.activeAccount === accountId) {
                state.activeAccount = null;
            }
            delete state.accounts[accountId];
            this.storage.setState(networkId, state);
        });
    }
    getNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            let state = yield this.storage.getFullState();
            return Object.keys(state.accounts);
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storage.clear();
        });
    }
}
exports.HereKeyStore = HereKeyStore;
//# sourceMappingURL=HereKeyStore.js.map