"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAction = exports.parseArgs = void 0;
const crypto_1 = require("@near-js/crypto");
const transactions_1 = require("@near-js/transactions");
const getAccessKey = (permission) => {
    if (permission === "FullAccess") {
        return transactions_1.actionCreators.fullAccessKey();
    }
    const { receiverId, methodNames = [] } = permission;
    const allowance = permission.allowance ? BigInt(permission.allowance) : undefined;
    return transactions_1.actionCreators.functionCallAccessKey(receiverId, methodNames, allowance);
};
const parseArgs = (data) => {
    if (typeof data === "string")
        return Buffer.from(data, "base64");
    return data;
};
exports.parseArgs = parseArgs;
const createAction = (action) => {
    switch (action.type) {
        case "CreateAccount":
            return transactions_1.actionCreators.createAccount();
        case "DeployContract": {
            const { code } = action.params;
            return transactions_1.actionCreators.deployContract(code);
        }
        case "FunctionCall": {
            const { methodName, args, gas, deposit } = action.params;
            return transactions_1.actionCreators.functionCall(methodName, (0, exports.parseArgs)(args), BigInt(gas), BigInt(deposit));
        }
        case "Transfer": {
            const { deposit } = action.params;
            return transactions_1.actionCreators.transfer(BigInt(deposit));
        }
        case "Stake": {
            const { stake, publicKey } = action.params;
            return transactions_1.actionCreators.stake(BigInt(stake), crypto_1.PublicKey.from(publicKey));
        }
        case "AddKey": {
            const { publicKey, accessKey } = action.params;
            return transactions_1.actionCreators.addKey(crypto_1.PublicKey.from(publicKey), // TODO: Use accessKey.nonce? near-api-js seems to think 0 is fine?
            getAccessKey(accessKey.permission));
        }
        case "DeleteKey": {
            const { publicKey } = action.params;
            return transactions_1.actionCreators.deleteKey(crypto_1.PublicKey.from(publicKey));
        }
        case "DeleteAccount": {
            const { beneficiaryId } = action.params;
            return transactions_1.actionCreators.deleteAccount(beneficiaryId);
        }
        default:
            throw new Error("Invalid action type");
    }
};
exports.createAction = createAction;
//# sourceMappingURL=actions.js.map