import { Wallet, BytesLike, TypedDataField, providers } from 'ethers';
import { Hex, toHex } from "viem";
import { ethers } from "ethers";
import { DynamicWalletProvider } from './dynamic.wallet-provider';
import { base64urlToArrayBuffer, parseSignature, PublicKeyInformations, getPublicKey } from './utils/passkeyHelperMethods';


export class PassKeyProvider extends DynamicWalletProvider {
  readonly type = 'Passkey';

  readonly wallet: Wallet;

  readonly credentialId: string;

  readonly ethereumAddress: string;

  constructor() {
    super("");
    let publicKeyRaw = localStorage.getItem('passKeyCredentials') || '';
    let rawId = localStorage.getItem('credentialRawId') || '';
    if (!publicKeyRaw && !rawId) {
      return;
    }
    let credetials = JSON.parse(publicKeyRaw);
    this.credentialId = rawId;
    let pubKeyInforamtions: PublicKeyInformations = getPublicKey(credetials.publicKey.data);
    this.ethereumAddress = pubKeyInforamtions.ethereumAddress;
    const pubKey: [Hex, Hex] = [pubKeyInforamtions.x, pubKeyInforamtions.y];
    this.setAddress(this.ethereumAddress);
    this.setPublicKey(pubKey);

  }
  get address(): string {
    return this.ethereumAddress;
  }



  async signMessage(message: BytesLike,precompiledP256Deployed: boolean): Promise<string> {

    const originalHash = ethers.utils.hexZeroPad(ethers.utils.hexlify(message), 32) as `0x${string}`; // Cast to `0x${string}` type
    const msgToSign = ethers.utils.defaultAbiCoder.encode(["bytes32"], [originalHash]);
    const credentialIdArrayBuffer = base64urlToArrayBuffer(this.credentialId);

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: Buffer.from(msgToSign.slice(2), 'hex'),
        allowCredentials: [{
          id: credentialIdArrayBuffer,
          type: 'public-key',
        }],
        timeout: 60000,
        userVerification: 'preferred',
      },
    }) as PublicKeyCredential;;

    let cred = assertion as unknown as {
      rawId: ArrayBuffer;
      response: {
        clientDataJSON: ArrayBuffer;
        authenticatorData: ArrayBuffer;
        signature: ArrayBuffer;
        userHandle: ArrayBuffer;
      };
    };

    const utf8Decoder = new TextDecoder("utf-8");

    const decodedClientData = utf8Decoder.decode(cred.response.clientDataJSON);
    const clientDataObj = JSON.parse(decodedClientData);

    let authenticatorData = toHex(new Uint8Array(cred.response.authenticatorData));
    let signature = parseSignature(new Uint8Array(cred?.response?.signature));

    let credentials = {
      rawId: toHex(new Uint8Array(cred.rawId)),
      clientData: {
        type: clientDataObj.type,
        challenge: clientDataObj.challenge,
        origin: clientDataObj.origin,
        crossOrigin: clientDataObj.crossOrigin,
      },

      authenticatorData,
      signature,
    };

    let sNew = BigInt(credentials.signature.s);
    const N = BigInt("0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551");

    if (sNew > N / BigInt(2)) {
      sNew = N - sNew;
    }
    const sHex = sNew.toString(16).padStart(64, '0');
     const encodedSignature = ethers.utils.defaultAbiCoder.encode(
      [
        "tuple(bytes authenticatorData, string clientDataJSON, uint256 challengeLocation, uint256 responseTypeLocation, bytes32 r, bytes32 s,bool precompiledP256Deployed)"
      ],
      [
        [
          credentials.authenticatorData,
          JSON.stringify(credentials.clientData),
          23,
          1,
          credentials.signature.r,
          `0x${sHex}`,
          precompiledP256Deployed
        ]
      ]
    );
     return encodedSignature;
  }

  async signTypedData(typedData: TypedDataField[], message: any, accountAddress: string): Promise<string> {
    throw new Error('Not supported in this connectedProvider');
  }




}
