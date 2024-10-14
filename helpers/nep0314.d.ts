/// <reference types="node" />
import * as borsh from "borsh";
import { SignedMessageNEP0413, SignMessageOptionsNEP0413 } from "../types";
export declare class AuthPayload implements SignMessageOptionsNEP0413 {
    readonly message: string;
    readonly recipient: string;
    readonly nonce: Buffer;
    readonly callbackUrl?: string | undefined;
    readonly tag: number;
    constructor({ message, nonce, recipient, callbackUrl }: SignMessageOptionsNEP0413);
}
export declare const authPayloadSchema: borsh.Schema;
export declare function verifySignature(request: SignMessageOptionsNEP0413, result: SignedMessageNEP0413): boolean;
