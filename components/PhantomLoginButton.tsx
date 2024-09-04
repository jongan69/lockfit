
import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import * as Linking from "expo-linking";
import { useAuthStore } from "../stores/AuthStore";
import { decryptPayload, encryptPayload, buildUrl } from "../utils/solana";
import { router, useLocalSearchParams } from "expo-router";

interface LoginButtonProps {
  submitting?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ submitting }) => {
  const { logout, isAuthenticated, setSharedSecret, setSession, session, setPublicKey, getPublicKey, getSharedSecretUint8Array, setDappKeyPair, getDappKeyPair } = useAuthStore();
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] = useState<PublicKey | null>(null);
  const [dappKeyPair] = useState(nacl.box.keyPair());
  const [deepLink, setDeepLink] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { disconnectParam } = useLocalSearchParams();

  const handleDeepLink = useCallback(
    ({ url }: Linking.EventType) => {
      setDeepLink(url);
      console.log("Received deep link:", url);
    },
    [setDeepLink]
  );

  useEffect(() => {
    const initializeDeeplinks = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        setDeepLink(initialUrl);
        console.log("Initial URL:", initialUrl);
      }
    };
    initializeDeeplinks();
    const listener = Linking.addEventListener("url", handleDeepLink);
    return () => {
      listener.remove();
    };
  }, [handleDeepLink]);

  const handleConnect = useCallback(async (params: URLSearchParams) => {
    try {
      console.log("Handling connection...");
      const phantomEncryptionPublicKey = bs58.decode(params.get("phantom_encryption_public_key")!);
      if (phantomEncryptionPublicKey.length !== nacl.box.publicKeyLength) {
        throw new Error("Invalid Phantom encryption public key size");
      }
      const sharedSecretDapp = nacl.box.before(phantomEncryptionPublicKey, dappKeyPair.secretKey);
      console.log("sharedSecretDapp", sharedSecretDapp.toLocaleString());
      const connectData = decryptPayload(
        params.get("data")!,
        params.get("nonce")!,
        sharedSecretDapp
      );
      console.log("Connect data:", connectData);
      setSession(connectData.session);
      const publicKey = new PublicKey(connectData.public_key);
      setPhantomWalletPublicKey(publicKey);

      if (connectData.session) {
        // Save the shared secret in the auth store as a base64 string
        const sharedSecretBase64 = Buffer.from(sharedSecretDapp).toString('base64');
        setSharedSecret(sharedSecretBase64);
        setSession(connectData.session);
        setPublicKey(publicKey.toString());
        setDappKeyPair(dappKeyPair);
        const encodedPublicKey = encodeURIComponent(publicKey.toString());
        router.push({
          pathname: "/signinComplete",
          params: { publicKey: encodedPublicKey }
        });
        console.log(`Connected to ${publicKey.toString()}`);
        Alert.alert("Connection Successful", `Connected to ${publicKey.toString()}`);
      }
    } catch (error) {
      console.error("Error during connection:", error);
      Alert.alert("Connection Error", "Failed to establish connection. Please try again.");
      setError("Failed to establish connection. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  }, [dappKeyPair, setSession, setSharedSecret, setPublicKey, setDappKeyPair]);

  const handleError = useCallback((params: URLSearchParams) => {
    const error = Object.fromEntries([...params]);
    const message = error?.errorMessage ?? JSON.stringify(error, null, 2);
    console.error("Phantom connection error:", message);
    Alert.alert("Connection Error", message);
    setError(message);
    setIsConnecting(false);
    setIsDisconnecting(false);
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log("Handling disconnection...");
    setPhantomWalletPublicKey(null);
    setSharedSecret(null);
    setSession(null);
    setPublicKey(null);
    logout();
    console.log("Disconnected");
    Alert.alert("Disconnected", "You have been disconnected from Phantom wallet.");
    setIsDisconnecting(false);
  }, [logout, setSharedSecret, setSession, setPublicKey]);

  useEffect(() => {
    if (!deepLink) return;

    const url = new URL(deepLink);
    const params = url.searchParams;

    console.log("Processing deep link:", deepLink);

    if (params.get("errorCode")) {
      console.log('errorCode', params.get("errorCode"));
      handleError(params);
      return;
    }

    if (params.get("phantom_encryption_public_key")) {
      console.log("phantom_encryption_public_key", params.get("phantom_encryption_public_key"));
      handleConnect(params);
    } else if (disconnectParam === "true") {
      console.log('disconnectParam:', disconnectParam);
      handleDisconnect();
    }
  }, [deepLink, disconnectParam, handleConnect, handleDisconnect, handleError]);

  const connect = async () => {
    console.log("Initiating connection...");
    setError(null);
    setIsConnecting(true);
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: "mainnet-beta",
      app_url: "https://lock.wtf", // Replace with your app URL
      redirect_link: Linking.createURL("settings?disconnectParam=false"),
    });

    const url = buildUrl("connect", params);
    console.log("Opening URL:", url);
    Linking.openURL(url);
  };

  const disconnect = async () => {
    const currentDappKeyPair = getDappKeyPair();
    const sharedSecret = getSharedSecretUint8Array();
    console.log("Initiating disconnection...");
    setIsDisconnecting(true);
    try {
      if (!session || !sharedSecret || !currentDappKeyPair) {
        throw new Error("Session or shared secret is not available");
      }

      const payload = { session };
      const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);
      const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(currentDappKeyPair.publicKey),
        nonce: bs58.encode(nonce),
        redirect_link: Linking.createURL("settings?disconnectParam=true"),
        payload: bs58.encode(encryptedPayload),
      });
      const url = buildUrl("disconnect", params);
      console.log("Opening URL:", url);
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error during disconnection:", error);
      Alert.alert("Disconnection Error", "Failed to disconnect. Please try again.");
      handleDisconnect(); // Force disconnect even if there's an error
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {isAuthenticated ? (
        <>
          <View style={[styles.row, styles.wallet]}>
            <View style={styles.greenDot} />
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="middle">
              {`Connected to: ${getPublicKey()?.toString()}`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={disconnect}
            disabled={isDisconnecting}
          >
            <Text style={styles.buttonText}>
              {isDisconnecting ? "Disconnecting..." : "Disconnect"}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={connect}
          disabled={isConnecting}
        >
          <Text style={styles.buttonText}>
            {isConnecting ? "Connecting..." : "Connect Phantom"}
          </Text>
        </TouchableOpacity>
      )}
      {submitting && (
        <ActivityIndicator
          color="white"
          size="large"
          style={styles.spinner}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  greenDot: {
    height: 8,
    width: 8,
    borderRadius: 10,
    marginRight: 5,
    backgroundColor: "green",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  spinner: {
    marginTop: 20,
  },
  text: {
    width: "100%",
  },
  wallet: {
    alignItems: "center",
    margin: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginButton;
