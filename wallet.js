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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HereWallet = void 0;
const accounts_1 = require("@near-js/accounts");
const signers_1 = require("@near-js/signers");
const providers_1 = require("@near-js/providers");
const crypto_1 = require("@near-js/crypto");
const crypto_2 = require("crypto");
const js_sha256_1 = require("js-sha256");
const bn_js_1 = __importDefault(require("bn.js"));
const actions_1 = require("./helpers/actions");
const nep0314_1 = require("./helpers/nep0314");
const utils_1 = require("./helpers/utils");
const HereKeyStore_1 = require("./storage/HereKeyStore");
const WidgetStrategy_1 = require("./strategies/WidgetStrategy");
const types_1 = require("./types");
const TelegramAppStrategy_1 = require("./strategies/TelegramAppStrategy");
const InjectedStrategy_1 = require("./strategies/InjectedStrategy");
const waitInjected_1 = require("./helpers/waitInjected");
const telegramEthereumProvider_1 = require("./telegramEthereumProvider");
class AccessDenied extends Error {
}
class HereWallet {
    constructor({ injected, nodeUrl, networkId = "mainnet", authStorage, defaultStrategy } = {}) {
        this.authStorage = authStorage;
        this.strategy = defaultStrategy;
        Object.defineProperty(this, "ethAddress", { get: () => injected === null || injected === void 0 ? void 0 : injected.ethAddress });
        Object.defineProperty(this, "telegramId", { get: () => injected === null || injected === void 0 ? void 0 : injected.telegramId });
        Object.defineProperty(this, "ethProvider", { get: () => ((injected === null || injected === void 0 ? void 0 : injected.ethAddress) ? telegramEthereumProvider_1.hereWalletProvider : null) });
        const signer = new signers_1.InMemorySigner(this.authStorage);
        const rpc = new providers_1.JsonRpcProvider({ url: nodeUrl !== null && nodeUrl !== void 0 ? nodeUrl : `https://rpc.${networkId}.near.org` });
        this.connection = accounts_1.Connection.fromConfig({
            jsvmAccountId: `jsvm.${networkId}`,
            provider: rpc,
            networkId,
            signer,
        });
    }
    static connect(options = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (options.authStorage == null)
                options.authStorage = new HereKeyStore_1.HereKeyStore();
            if (options.defaultStrategy) {
                const wallet = new HereWallet(options);
                yield wallet.strategy.connect(wallet);
                return wallet;
            }
            if (typeof window !== "undefined") {
                if (window !== parent) {
                    const injected = yield waitInjected_1.waitInjectedHereWallet;
                    if (injected != null) {
                        options.defaultStrategy = new InjectedStrategy_1.InjectedStrategy();
                        const wallet = new HereWallet(Object.assign(Object.assign({}, options), { injected }));
                        yield wallet.strategy.connect(wallet);
                        return wallet;
                    }
                }
                if (((_a = window.Telegram) === null || _a === void 0 ? void 0 : _a.WebApp) != null) {
                    options.defaultStrategy = new TelegramAppStrategy_1.TelegramAppStrategy(options.botId, options.walletId);
                    const wallet = new HereWallet(options);
                    yield wallet.strategy.connect(wallet);
                    return wallet;
                }
            }
            options.defaultStrategy = new WidgetStrategy_1.WidgetStrategy();
            const wallet = new HereWallet(options);
            yield wallet.strategy.connect(wallet);
            return wallet;
        });
    }
    get rpc() {
        return this.connection.provider;
    }
    get signer() {
        return this.connection.signer;
    }
    get networkId() {
        return this.connection.networkId;
    }
    account(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = id !== null && id !== void 0 ? id : (yield this.authStorage.getActiveAccount(this.networkId));
            if (accountId == null)
                throw new AccessDenied("Wallet not signed in");
            return new accounts_1.Account(this.connection, accountId);
        });
    }
    isSignedIn() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.authStorage.getActiveAccount(this.networkId);
            return id != null;
        });
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = yield this.authStorage.getActiveAccount(this.networkId);
            if (accountId == null)
                throw new Error("Wallet not signed in");
            const key = yield this.authStorage.getKey(this.networkId, accountId);
            if (key != null) {
                const publicKey = key.getPublicKey().toString();
                yield this.silentSignAndSendTransaction({
                    receiverId: accountId,
                    actions: [{ type: "DeleteKey", params: { publicKey } }],
                }).catch(() => { });
            }
            yield this.authStorage.removeKey(this.networkId, accountId);
        });
    }
    getHereBalance(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.account(id);
            const contractId = this.networkId === "mainnet" ? "here.storage.near" : "here.storage.testnet";
            const hereCoins = yield account
                .viewFunction({ args: { account_id: account.accountId }, methodName: "ft_balance_of", contractId })
                .catch(() => "0");
            return new bn_js_1.default(hereCoins);
        });
    }
    getAvailableBalance(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.account(id);
            const result = yield account.getAccountBalance();
            const hereBalance = yield this.getHereBalance();
            return new bn_js_1.default(result.available).add(new bn_js_1.default(hereBalance));
        });
    }
    getAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authStorage.getAccounts(this.networkId);
        });
    }
    getAccountId() {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = yield this.authStorage.getActiveAccount(this.networkId);
            if (accountId == null)
                throw new Error("Wallet not signed in");
            return accountId;
        });
    }
    switchAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.authStorage.getKey(this.networkId, id);
            if (key == null)
                throw new Error(`Account ${id} not signed in`);
            yield this.authStorage.setActiveAccount(this.networkId, id);
        });
    }
    signIn({ contractId, allowance, methodNames = [], strategy = this.strategy, signal, callbackUrl, selector, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (contractId == null) {
                const { accountId } = yield this.authenticate({ strategy, signal, selector });
                // Generate random keypair
                yield this.authStorage.setKey(this.networkId, accountId, crypto_1.KeyPairEd25519.fromRandom());
                yield this.authStorage.setActiveAccount(this.networkId, accountId);
                return accountId;
            }
            yield strategy.onInitialized();
            try {
                const accessKey = crypto_1.KeyPair.fromRandom("ed25519");
                const permission = { receiverId: contractId, methodNames, allowance };
                const data = yield strategy.request({
                    signal,
                    accessKey,
                    callbackUrl,
                    request: {
                        type: "call",
                        network: this.networkId,
                        selector: selector || {},
                        transactions: [
                            {
                                actions: [
                                    {
                                        type: "AddKey",
                                        params: {
                                            publicKey: accessKey.getPublicKey().toString(),
                                            accessKey: { permission },
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                });
                if (data.account_id == null) {
                    throw Error("Transaction is failed");
                }
                yield this.authStorage.setKey(this.networkId, data.account_id, accessKey);
                yield this.authStorage.setActiveAccount(this.networkId, data.account_id);
                return data.account_id;
            }
            catch (error) {
                (0, utils_1.internalThrow)(error, strategy, selector);
                throw error;
            }
        });
    }
    silentSignAndSendTransaction({ actions, receiverId, signerId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.account(signerId);
            const localKey = yield this.authStorage.getKey(this.networkId, account.accountId).catch(() => null);
            if (localKey == null)
                throw new AccessDenied();
            const publicKey = localKey.getPublicKey();
            const accessKeys = yield account.getAccessKeys();
            const call = { receiverId, actions };
            const isValid = accessKeys.some((v) => {
                if (v.public_key !== publicKey.toString())
                    return false;
                return (0, utils_1.isValidAccessKey)(account.accountId, v, call);
            });
            if (isValid === false)
                throw new AccessDenied();
            return yield account.signAndSendTransaction({
                actions: actions.map((a) => (0, actions_1.createAction)(a)),
                receiverId: receiverId !== null && receiverId !== void 0 ? receiverId : account.accountId,
            });
        });
    }
    signAndSendTransaction(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { signerId, receiverId, actions, callbackUrl, strategy = this.strategy, signal, selector } = opts;
            yield strategy.onInitialized();
            try {
                const result = yield this.silentSignAndSendTransaction({ receiverId, actions, signerId });
                const success = { type: "web", status: types_1.HereProviderStatus.SUCCESS, payload: result === null || result === void 0 ? void 0 : result.transaction_outcome.id };
                strategy.onSuccess(success);
                return result;
            }
            catch (e) {
                try {
                    // If silent sign return AccessDenied or NotEnoughAllowance we request mobile wallet
                    // OR its just transaction error
                    if (!(e instanceof AccessDenied) && (e === null || e === void 0 ? void 0 : e.type) !== "NotEnoughAllowance") {
                        (0, utils_1.internalThrow)(e, strategy, selector);
                        throw e;
                    }
                    const activeAccount = yield this.getAccountId().catch(() => undefined);
                    const data = yield strategy.request({
                        signal,
                        callbackUrl,
                        request: {
                            type: "call",
                            network: this.networkId,
                            transactions: [{ actions: (0, utils_1.serializeActions)(actions), receiverId, signerId }],
                            selector: opts.selector || { id: signerId || activeAccount },
                        },
                    });
                    if (data.payload == null || data.account_id == null) {
                        throw Error("Transaction not found, but maybe executed");
                    }
                    return yield this.rpc.txStatus(data.payload, data.account_id, "INCLUDED");
                }
                catch (error) {
                    (0, utils_1.internalThrow)(error, strategy, selector);
                    throw error;
                }
            }
        });
    }
    verifyMessageNEP0413(request, result) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSignatureValid = (0, nep0314_1.verifySignature)(request, result);
            if (!isSignatureValid)
                throw Error("Incorrect signature");
            const account = yield this.account(result.accountId);
            const keys = yield account.getAccessKeys();
            const isFullAccess = keys.some((k) => {
                if (k.public_key !== result.publicKey)
                    return false;
                if (k.access_key.permission !== "FullAccess")
                    return false;
                return true;
            });
            if (!isFullAccess)
                throw Error("Signer public key is not full access");
            return true;
        });
    }
    authenticate(options = {}) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const signRequest = {
                nonce: (_a = options.nonce) !== null && _a !== void 0 ? _a : (0, crypto_2.randomBytes)(32),
                recipient: (_b = options.recipient) !== null && _b !== void 0 ? _b : window === null || window === void 0 ? void 0 : window.location.host,
                message: (_c = options.message) !== null && _c !== void 0 ? _c : "Authenticate",
            };
            const signed = yield this.signMessage(Object.assign(Object.assign({}, signRequest), options));
            yield this.verifyMessageNEP0413(signRequest, signed);
            return signed;
        });
    }
    signMessage(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { strategy = this.strategy, signal, selector, callbackUrl } = options;
            yield strategy.onInitialized();
            // Legacy format with receiver property, does not correspond to the current version of the standard
            if ("receiver" in options)
                return yield this.legacySignMessage(options);
            const activeAccount = yield this.getAccountId().catch(() => undefined);
            const data = yield strategy.request({
                signal,
                callbackUrl,
                request: {
                    type: "sign",
                    message: options.message,
                    recipient: options.recipient,
                    nonce: Array.from(options.nonce),
                    network: this.networkId,
                    selector: selector || { id: activeAccount },
                },
            });
            if ((data === null || data === void 0 ? void 0 : data.payload) == null)
                throw Error("Signature not found");
            const { publicKey, signature, accountId } = JSON.parse(data.payload);
            return { publicKey, signature, accountId };
        });
    }
    legacySignMessage(_a) {
        var { receiver, message, nonce } = _a, delegate = __rest(_a, ["receiver", "message", "nonce"]);
        return __awaiter(this, void 0, void 0, function* () {
            if (nonce == null) {
                let nonceArray = new Uint8Array(32);
                nonce = [...crypto.getRandomValues(nonceArray)];
            }
            const { strategy = this.strategy, callbackUrl, selector, signal } = delegate;
            const activeAccount = yield this.getAccountId().catch(() => undefined);
            const data = yield strategy.request({
                signal,
                callbackUrl,
                request: {
                    type: "sign",
                    network: this.networkId,
                    selector: selector || { id: activeAccount },
                    message,
                    receiver,
                    nonce,
                },
            });
            if ((data === null || data === void 0 ? void 0 : data.payload) == null) {
                throw Error("Signature not found");
            }
            try {
                const { publicKey, signature, accountId } = JSON.parse(data.payload);
                const sign = new Uint8Array(Buffer.from(signature, "base64"));
                const json = JSON.stringify({ message, receiver, nonce });
                const msg = new Uint8Array(js_sha256_1.sha256.digest(`NEP0413:` + json));
                const isVerify = crypto_1.PublicKey.from(publicKey).verify(msg, sign);
                if (isVerify === false)
                    throw Error();
                const account = yield this.account(accountId);
                const keys = yield account.getAccessKeys();
                const pb = publicKey.toString();
                const isValid = keys.some((k) => {
                    if (k.public_key !== pb)
                        return false;
                    if (k.access_key.permission !== "FullAccess")
                        return false;
                    return true;
                });
                if (isValid === false)
                    throw Error();
                return {
                    signature: new Uint8Array(Buffer.from(signature, "base64")),
                    publicKey: crypto_1.PublicKey.from(publicKey),
                    message: `NEP0413:` + json,
                    receiver,
                    accountId,
                    nonce,
                };
            }
            catch (_b) {
                throw Error("Signature not correct");
            }
        });
    }
    signAndSendTransactions(_a) {
        var { transactions } = _a, delegate = __rest(_a, ["transactions"]);
        return __awaiter(this, void 0, void 0, function* () {
            const { strategy = this.strategy, selector, callbackUrl, signal } = delegate;
            yield strategy.onInitialized();
            let results = [];
            try {
                for (const call of transactions) {
                    const r = yield this.silentSignAndSendTransaction(call);
                    results.push(r);
                }
                const payload = results.map((result) => result.transaction_outcome.id).join(",");
                const success = { type: "web", status: types_1.HereProviderStatus.SUCCESS, payload };
                strategy.onSuccess(success);
                return results;
            }
            catch (e) {
                try {
                    // If silent sign return access denied or not enough balance we request mobile wallet
                    // OR its just transaction error
                    if (!(e instanceof AccessDenied) && (e === null || e === void 0 ? void 0 : e.type) !== "NotEnoughAllowance") {
                        (0, utils_1.internalThrow)(e, strategy, selector);
                        throw e;
                    }
                    const activeAccount = yield this.getAccountId().catch(() => undefined);
                    const uncompleted = transactions.slice(results.length);
                    const data = yield strategy.request({
                        signal,
                        callbackUrl,
                        request: {
                            type: "call",
                            network: this.networkId,
                            selector: selector || { id: uncompleted[0].signerId || activeAccount },
                            transactions: uncompleted.map((trx) => (Object.assign(Object.assign({}, trx), { actions: (0, utils_1.serializeActions)(trx.actions) }))),
                        },
                    });
                    if (data.payload == null || data.account_id == null) {
                        throw Error("Transaction not found, but maybe executed");
                    }
                    const promises = data.payload.split(",").map((id) => this.rpc.txStatus(id, data.account_id, "INCLUDED"));
                    return yield Promise.all(promises);
                }
                catch (error) {
                    (0, utils_1.internalThrow)(error, strategy, selector);
                    throw error;
                }
            }
        });
    }
}
exports.HereWallet = HereWallet;
//# sourceMappingURL=wallet.js.map