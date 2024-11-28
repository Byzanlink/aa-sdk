import { AsnParser } from '@peculiar/asn1-schema';
import { ECDSASigValue } from '@peculiar/asn1-ecc';
import cbor from "cbor"; // Make sure to install this: npm install cbor
import { toHex, Hex } from "viem";
import { ethers } from "ethers";



export type P256Signature = {
    r: Hex;
    s: Hex;
};

export type PublicKeyInformations = {
    x: Hex;
    y: Hex;
    ethereumAddress: string;
};


export const getPublicKey = (coseKey) => {
    const coseBuffer = Buffer.from(coseKey);
    const { x, y } = extractXYFromCOSEKey(coseBuffer);
    const xHash = x.startsWith('0x') ? x.slice(2) : x;
    const yHAsh = y.startsWith('0x') ? y.slice(2) : y;
    const uncompressedPublicKey = '0x04' + xHash + yHAsh;
    // Hash the public key using Keccak-256
    const hashedPublicKey = ethers.utils.keccak256(uncompressedPublicKey);
    // Extract the last 20 bytes (Ethereum address)
    const ethereumAddress = '0x' + hashedPublicKey.slice(-40);
    return { ethereumAddress, x, y };
}
export const extractXYFromCOSEKey = (coseKeyBuffer: Buffer): { x: any; y: any } | null => {
    try {
        // Decode the CBOR data to get the COSE key as an object
        const coseKey = cbor.decode(coseKeyBuffer);
        // Check COSE structure for expected parameters
        const x = toHex(coseKey.get(-2)); // x coordinate
        const y = toHex(coseKey.get(-3)); // y coordinate

        if (!x || !y) {
            throw new Error('COSE key does not contain x or y coordinates');
        }
        return { x, y };
    } catch (error) {
        console.error('Failed to decode COSE key:', error);
        return null;
    }
}
// Convert a base64-url string to an ArrayBuffer
export const base64urlToArrayBuffer = (base64url) => {
    const padding = '==='.slice(0, (4 - base64url.length % 4) % 4);
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/') + padding;
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
export const parseSignature = (signature: Uint8Array): { r: string; s: string } => {
    const parsedSignature = AsnParser.parse(signature, ECDSASigValue);
    let rBytes = new Uint8Array(parsedSignature.r);
    let sBytes = new Uint8Array(parsedSignature.s);
    if (shouldRemoveLeadingZero(rBytes)) {
        rBytes = rBytes.slice(1);
    }
    if (shouldRemoveLeadingZero(sBytes)) {
        sBytes = sBytes.slice(1);
    }
    const finalSignature = concatUint8Arrays([rBytes, sBytes]);

    return {
        r: toHex(finalSignature.slice(0, 32)),
        s: toHex(finalSignature.slice(32)),
    };
}

export const shouldRemoveLeadingZero = (bytes: Uint8Array): boolean => {
    return bytes[0] === 0x0 && (bytes[1] & (1 << 7)) !== 0;
}

export const concatUint8Arrays = (arrays: Uint8Array[]): Uint8Array => {
    let pointer = 0;
    const totalLength = arrays.reduce((prev, curr) => prev + curr.length, 0);

    const toReturn = new Uint8Array(totalLength);

    arrays.forEach((arr) => {
        toReturn.set(arr, pointer);
        pointer += arr.length;
    });

    return toReturn;
}


