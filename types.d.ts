/// <reference types="node" />
import BN from "bn.js";
import { Account, Connection } from "@near-js/accounts";
import { FinalExecutionOutcome } from "@near-js/types";
import { KeyPair, PublicKey } from "@near-js/crypto";
import { Base64, Optional, Transaction } from "./helpers/types";
import { HereAuthStorage } from "./storage/HereKeyStore";
import { HereStrategy } from "./strategies/HereStrategy";
import { InjectedState } from "./helpers/waitInjected";
declare global {
    var Telegram: {
        WebApp?: any;
    } | undefined;
}
export declare type SelectorType = {
    id?: string;
    type?: string;
};
export declare type HereProviderSign = ({
    network?: string;
    type: "sign";
    selector?: SelectorType;
    callbackUrl?: string;
    telegramApp?: string;
} & SignMessageOptionsLegacy) | {
    network?: string;
    type: "sign";
    nonce: number[];
    message: string;
    recipient: string;
    selector: SelectorType;
    callbackUrl?: string;
    telegramApp?: string;
};
export declare type HereProviderCall = {
    network?: string;
    transactions: HereCall[];
    type: "call";
    selector: SelectorType;
    callbackUrl?: string;
    telegramApp?: string;
};
export declare type HereProviderImport = {
    type: "import";
    keystore: string;
    network?: string;
    selector: SelectorType;
    callbackUrl?: string;
    telegramApp?: string;
};
export declare type HereProviderKeypom = {
    type: "keypom";
    contract: string;
    secret: string;
    selector: SelectorType;
    callbackUrl?: string;
    telegramApp?: string;
};
export declare type HereProviderRequest = HereProviderCall | HereProviderSign | HereProviderImport | HereProviderKeypom;
export declare enum HereProviderStatus {
    APPROVING = 1,
    FAILED = 2,
    SUCCESS = 3
}
export interface HereProviderResult {
    type: string;
    path?: string;
    public_key?: string;
    account_id?: string;
    payload?: string;
    topic?: string;
    status: HereProviderStatus;
}
export declare class HereProviderError extends Error {
    readonly payload?: string | undefined;
    readonly parentError?: Error | undefined;
    constructor(payload?: string | undefined, parentError?: Error | undefined);
}
export declare type HereCall = Optional<Transaction, "signerId">;
export interface HereAsyncOptions {
    signal?: AbortSignal;
    strategy?: HereStrategy;
    selector?: {
        type: string;
        id?: string;
    };
    callbackUrl?: string;
}
export interface SignInOptions extends HereAsyncOptions {
    contractId?: string;
    allowance?: string;
    methodNames?: string[];
}
export declare type SignAndSendTransactionOptions = HereAsyncOptions & HereCall;
export declare type SignMessageOptionsLegacy = {
    nonce?: number[];
    message: string;
    receiver: string;
};
export declare type SignMessageOptionsNEP0413 = {
    message: string;
    recipient: string;
    nonce: Buffer;
    callbackUrl?: string;
};
export declare type SignMessageOptions = (HereAsyncOptions & SignMessageOptionsNEP0413) | (HereAsyncOptions & SignMessageOptionsLegacy);
export declare type SignMessageLegacyReturn = {
    signature: Uint8Array;
    publicKey: PublicKey;
    accountId: string;
    message: string;
    nonce: number[];
    receiver: string;
};
export declare type SignedMessageNEP0413 = {
    signature: Base64;
    publicKey: string;
    accountId: string;
};
export interface SignAndSendTransactionsOptions extends HereAsyncOptions {
    transactions: HereCall[];
}
export interface HereInitializeOptions {
    nodeUrl?: string;
    networkId?: "mainnet" | "testnet";
    authStorage?: HereAuthStorage;
    botId?: string;
    walletId?: string;
    defaultStrategy?: HereStrategy;
    injected?: InjectedState;
}
export interface HereStrategyRequest {
    id?: string;
    request: HereProviderRequest;
    disableCleanupRequest?: boolean;
    signal?: AbortSignal;
    accessKey?: KeyPair;
    callbackUrl?: string;
}
export interface HereWalletProtocol {
    readonly networkId: string;
    readonly connection: Connection;
    readonly authStorage: HereAuthStorage;
    readonly strategy: HereStrategy;
    account(id?: string): Promise<Account>;
    getAccounts(): Promise<string[]>;
    switchAccount(id: string): Promise<void>;
    getAccountId(): Promise<string>;
    isSignedIn: () => Promise<boolean>;
    signOut: () => Promise<void>;
    getHereBalance: () => Promise<BN>;
    getAvailableBalance: () => Promise<BN>;
    signIn: (data: SignInOptions) => Promise<string>;
    signAndSendTransaction: (data: SignAndSendTransactionOptions) => Promise<FinalExecutionOutcome>;
    signAndSendTransactions: (data: SignAndSendTransactionsOptions) => Promise<Array<FinalExecutionOutcome>>;
    signMessage: {
        (data: HereAsyncOptions & SignMessageOptionsNEP0413): Promise<SignedMessageNEP0413>;
        (data: HereAsyncOptions & SignMessageOptionsLegacy): Promise<SignMessageLegacyReturn>;
    };
}
