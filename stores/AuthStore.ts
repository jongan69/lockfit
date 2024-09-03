import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { Buffer } from 'buffer';
import nacl from 'tweetnacl';

interface AuthState {
  token: string | null;
  publicKey: string | null;
  isAuthenticated: boolean;
  sharedSecret: string | null;
  session: string | null;
  setAuth: (token: string, publicKey: string, sharedSecret: string, session: string) => void;
  logout: () => void;
  loadToken: () => void;
  setSharedSecret: (secret: string | null) => void;
  setSession: (session: string | null) => void;
  getSharedSecretUint8Array: () => Uint8Array | null;
  getPublicKey: () => string | null;
  setPublicKey: (publicKey: string | null) => void;
  setDappKeyPair: (dappKeyPair: nacl.BoxKeyPair) => void;
  getDappKeyPair: () => nacl.BoxKeyPair;
  dappKeyPair: nacl.BoxKeyPair;
  setNonce: (nonce: string | null) => void;
  getNonce: () => string | null;
  nonce: string | null;
}

const secureStorage = {
  getItem: async (key: string) => {
    const value = await SecureStore.getItemAsync(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

const initialDappKeyPair = nacl.box.keyPair();

const initialState = {
  token: null,
  publicKey: null,
  isAuthenticated: false,
  sharedSecret: null,
  session: null,
  dappKeyPair: initialDappKeyPair,
  nonce: null,
};

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      ...initialState,
      setNonce: (nonce: string | null) => set({ nonce }),
      getNonce: () => get().nonce,
      setAuth: (token, publicKey, sharedSecret, session) => {
        set({ token, publicKey, sharedSecret, session, isAuthenticated: true });
      },
      setPublicKey: (publicKey: string | null) => set({ publicKey }),
      getPublicKey: () => get().publicKey,
      logout: () => {
        set({ ...initialState, dappKeyPair: get().dappKeyPair });
      },
      loadToken: async () => {
        const token = await SecureStore.getItemAsync("authToken");
        if (token) {
          set({ token, isAuthenticated: true });
        }
      },
      setDappKeyPair: (dappKeyPair: nacl.BoxKeyPair) => set({ dappKeyPair }),
      getDappKeyPair: () => get().dappKeyPair,
      setSharedSecret: (secret: string | null) => set({ sharedSecret: secret }),
      getSharedSecret: () => get().sharedSecret,
      setSession: (session: string | null) => set({ session }),
      getSharedSecretUint8Array: () => {
        const { sharedSecret } = get();
        return sharedSecret ? new Uint8Array(Buffer.from(sharedSecret, 'base64')) : null;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
