export declare type InjectedState = {
    ethAddress?: string;
    accountId: string;
    network: string;
    publicKey: string;
    telegramId: number;
};
export declare const waitInjectedHereWallet: Promise<InjectedState | null>;
