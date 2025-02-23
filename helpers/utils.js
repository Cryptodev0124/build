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
exports.isValidAccessKey = exports.internalThrow = exports.getPublicKeys = exports.serializeActions = exports.isMobile = exports.getDeviceId = void 0;
const uuid4_1 = __importDefault(require("uuid4"));
const types_1 = require("../types");
const getDeviceId = () => {
    const topicId = (window === null || window === void 0 ? void 0 : window.localStorage.getItem("herewallet-topic")) || (0, uuid4_1.default)();
    window === null || window === void 0 ? void 0 : window.localStorage.setItem("herewallet-topic", topicId);
    return topicId;
};
exports.getDeviceId = getDeviceId;
const isMobile = () => {
    return (window === null || window === void 0 ? void 0 : window.matchMedia("(any-pointer:coarse)").matches) || false;
};
exports.isMobile = isMobile;
const serializeActions = (actions) => {
    return actions.map((act) => {
        if (act.type !== "FunctionCall")
            return act;
        let { args, deposit, gas, methodName } = act.params;
        if (ArrayBuffer.isView(args)) {
            args = Buffer.from(args.buffer, args.byteOffset, args.byteLength);
        }
        if (args instanceof Buffer) {
            args = args.toString("base64");
        }
        return {
            type: act.type,
            params: { args, deposit, gas, methodName },
        };
    });
};
exports.serializeActions = serializeActions;
const getPublicKeys = (rpc, accountId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(rpc, {
        method: "POST",
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "dontcare",
            method: "query",
            params: {
                request_type: "view_access_key_list",
                finality: "final",
                account_id: accountId,
            },
        }),
        headers: {
            "content-type": "application/json",
        },
    });
    if (res.ok === false) {
        return [];
    }
    const data = yield res.json();
    return data.result.keys;
});
exports.getPublicKeys = getPublicKeys;
const internalThrow = (error, strategy, selector) => {
    if (error instanceof types_1.HereProviderError) {
        throw error;
    }
    const result = {
        payload: error instanceof Error ? error.message : "UNKNOWN",
        status: types_1.HereProviderStatus.FAILED,
        type: (selector === null || selector === void 0 ? void 0 : selector.type) || "web",
        account_id: (selector === null || selector === void 0 ? void 0 : selector.id) || "",
    };
    strategy.onFailed(result);
    throw error;
};
exports.internalThrow = internalThrow;
const isValidAccessKey = (accountId, accessKey, call) => {
    const { permission } = accessKey.access_key;
    if (permission === "FullAccess") {
        return true;
    }
    if (permission.FunctionCall) {
        const { receiver_id: allowedReceiverId, method_names: allowedMethods } = permission.FunctionCall;
        /********************************
        Accept multisig access keys and let wallets attempt to signAndSendTransaction
        If an access key has itself as receiverId and method permission add_request_and_confirm, then it is being used in a wallet with multisig contract: https://github.com/near/core-contracts/blob/671c05f09abecabe7a7e58efe942550a35fc3292/multisig/src/lib.rs#L149-L153
        ********************************/
        if (allowedReceiverId === accountId && allowedMethods.includes("add_request_and_confirm")) {
            return true;
        }
        if (allowedReceiverId === call.receiverId) {
            if (call.actions.length !== 1)
                return false;
            return call.actions.every((action) => {
                if (action.type !== "FunctionCall")
                    return false;
                return ((!action.params.deposit || action.params.deposit.toString() === "0") &&
                    (allowedMethods.length === 0 || allowedMethods.includes(action.params.methodName)));
            });
        }
    }
    return false;
};
exports.isValidAccessKey = isValidAccessKey;
//# sourceMappingURL=utils.js.map