import { KeyPair } from "@near-js/crypto";
import { KeyStore } from "@near-js/keystores";
import { HereJsonStorage } from "./JSONStorage";
export interface HereAuthStorage extends KeyStore {
    setActiveAccount(network: string, id: string): Promise<void>;
    getActiveAccount(network: string): Promise<string | null>;
}
export declare class HereKeyStore implements HereAuthStorage {
    private storage;
    constructor(storage?: HereJsonStorage);
    setActiveAccount(network: string, id: string): Promise<void>;
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    getAccounts(network: string): Promise<string[]>;
    getActiveAccount(network: string): Promise<string | null>;
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    removeKey(networkId: string, accountId: string): Promise<void>;
    getNetworks(): Promise<string[]>;
    clear(): Promise<void>;
}
