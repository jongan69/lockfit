import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import Toast from "react-native-toast-message";
import { useTheme } from "@/context/ThemeContext";
import { createThemedStyles } from "@/styles/theme";

global.Buffer = global.Buffer || Buffer;

const NETWORK = clusterApiUrl("mainnet-beta");
const useUniversalLinks = false;

const buildUrl = (path: string, params: URLSearchParams) =>
  `${useUniversalLinks ? "https://phantom.app/ul/" : "phantom://"}v1/${path}?${params.toString()}`;

const LoginButton = ({ onConnect, onError }: { onConnect: (publicKey: string) => void, onError: (error: string) => void }) => {
  const theme = useTheme();
  const isDarkMode = theme?.isDarkMode;
  const styles = createThemedStyles(isDarkMode ?? false);
  const [deepLink, setDeepLink] = useState<string>("");
  const [sharedSecret, setSharedSecret] = useState<Uint8Array | undefined>();
  const [session, setSession] = useState<string | undefined>();
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] = useState<PublicKey | undefined>();
  const [dappKeyPair] = useState(nacl.box.keyPair());
  const connection = new Connection(NETWORK);

  useEffect(() => {
    const handleDeepLink = ({ url }: Linking.EventType) => {
      setDeepLink(url);
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!deepLink) return;

    const url = new URL(deepLink);
    const params = url.searchParams;

    if (params.get("errorCode")) {
      onError(JSON.stringify(Object.fromEntries([...params]), null, 2));
      return;
    }

    try {
      if (/settings/.test(url.pathname || url.host)) {
        const sharedSecretDapp = nacl.box.before(
          bs58.decode(params.get("phantom_encryption_public_key")!),
          dappKeyPair.secretKey
        );

        const connectData = decryptPayload(
          params.get("data")!,
          params.get("nonce")!,
          sharedSecretDapp
        );

        setSharedSecret(sharedSecretDapp);
        setSession(connectData.session);
        setPhantomWalletPublicKey(new PublicKey(connectData.public_key));

        onConnect(connectData.public_key);
        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: phantomWalletPublicKey?.toString(),
        });
      } else {
        Toast.show({
          type: "warning",
          text1: "Disconnected",
          text2: "Disconnected from Phantom",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError("An unknown error occurred");
      }
    }
  }, [deepLink]);

  const decryptPayload = (data: string, nonce: string, sharedSecret?: Uint8Array) => {
    if (!sharedSecret) throw new Error("missing shared secret");

    const decryptedData = nacl.box.open.after(bs58.decode(data), bs58.decode(nonce), sharedSecret);
    if (!decryptedData) {
      throw new Error("Unable to decrypt data");
    }
    return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
  };

  const connect = async () => {
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: "mainnet-beta",
      app_url: "https://phantom.app",
      redirect_link: Linking.createURL("settings")
    });

    const url = buildUrl("connect", params);
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity style={[styles.colorlist, { backgroundColor: styles.button.backgroundColor }]} onPress={connect}>
      <Text style={[styles.cardTitle, { color: styles.text.color }]}>
        Connect to Phantom
      </Text>
    </TouchableOpacity>
  );
};

const LogoutButton = ({ onLogout }: { onLogout: () => void }) => {
  const theme = useTheme();
  const isDarkMode = theme?.isDarkMode;
  const styles = createThemedStyles(isDarkMode ?? false);
  const disconnect = async () => {
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(nacl.box.keyPair().publicKey),
      redirect_link: Linking.createURL("settings"),
    });

    const url = buildUrl("disconnect", params);
    await Linking.openURL(url);
    onLogout();
  };

  return (
    <TouchableOpacity style={[styles.colorlist, { backgroundColor: styles.button.backgroundColor }]} onPress={disconnect}>
      <Text style={[styles.cardTitle]}>
        Disconnect from Phantom
      </Text>
    </TouchableOpacity>
  );
};

export { LoginButton, LogoutButton };
