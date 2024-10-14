declare const hereWalletProvider: {
    on(): void;
    isHereWallet: boolean;
    isConnected: () => boolean;
    request: (data: any) => Promise<any>;
};
export { hereWalletProvider };
