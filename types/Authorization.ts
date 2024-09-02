import { Base64EncodedAddress } from "@solana-mobile/mobile-wallet-adapter-protocol";
import { PublicKey } from "@solana/web3.js";

export type Authorization = Readonly<{
    address: Base64EncodedAddress;
    label?: string;
    publicKey: PublicKey;
    authToken: string;
  }>;

export type ConnectButtonProps = {
    onConnect: (authorization: Authorization) => void;
  };