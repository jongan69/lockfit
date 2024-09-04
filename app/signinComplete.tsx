import React, { useEffect, useState, useCallback } from 'react';
import * as Linking from 'expo-linking';
import { Connection, PublicKey } from "@solana/web3.js";
import Constants from "expo-constants";
import { router, Stack } from 'expo-router';
import { Alert, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { buildUrl, encryptPayload, decryptPayload } from "../utils/solana";
import { useAuthStore } from '../stores/AuthStore';

const backendUrl = Constants.expoConfig?.extra?.backendUrl;
const solanaRpcUrl = Constants.expoConfig?.extra?.rpcUrl;

const SigninComplete: React.FC = () => {
  const { getSharedSecretUint8Array, session, getPublicKey, getDappKeyPair, setAuth, setNonce, getNonce } = useAuthStore();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] = useState<PublicKey | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const sharedSecretUint8Array = getSharedSecretUint8Array();
  
  const requestNonce = useCallback(async (publicKey: string, retries = 3) => {
    try {
      const nonceResponse = await axios.post(
        `${backendUrl}/api/auth/request_nonce`,
        { publicKey }
      );
      const { nonce } = nonceResponse.data;
      setNonce(nonce);
      console.log("Received nonce:", nonce);
    } catch (error) {
      console.error("Failed to request nonce:", error);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => requestNonce(publicKey, retries - 1), 1000);
      } else {
        Alert.alert("Error", "Failed to request authentication nonce. Please try again.");
      }
    }
  }, [setNonce]);

  useEffect(() => {
    // Initialize Solana connection and decode public key
    const initializeConnection = async () => {
      const publicKey = getPublicKey();
      if (publicKey) {
        const decodedPublicKey = decodeURIComponent(publicKey);
        setPhantomWalletPublicKey(new PublicKey(decodedPublicKey));
        await requestNonce(publicKey);
        const newConnection = new Connection(solanaRpcUrl);
        setConnection(newConnection);
      } else {
        console.error('Public key is missing from the Store:', publicKey);
      }
    };

    initializeConnection();
  }, [getPublicKey, requestNonce]);

  const verifySignature = useCallback(async (publicKey: PublicKey, signature: any) => {
    try {
      console.log("Verifying signature...");
      
      if (!getNonce()) {
        throw new Error('Nonce is missing');
      }

      // Verify the signature locally
      const message = `Authentication nonce: ${getNonce()}`;
      const messageBytes = Buffer.from(message);
      const signatureBytes = bs58.decode(signature);
      
      console.log("signature", signature);
      const isVerified = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKey.toBytes()
      );

      if (!isVerified || !sharedSecretUint8Array || !session) {
        throw new Error('Invalid signature');
      }

      // If signature is valid, get JWT from backend
      const verifyResponse = await axios.post(
        `${backendUrl}/api/auth/verify_signature`,
        {
          publicKey: publicKey.toString(),
          signature: bs58.encode(signatureBytes),
          nonce: getNonce(),
        }
      );

      const { token } = verifyResponse.data;

      setAuth(token, publicKey.toString(), sharedSecretUint8Array.toString(), session);
      console.log("User authenticated successfully");
      Alert.alert("Authentication Successful", "You have been authenticated successfully.");
      router.replace('/settings');
    } catch (error) {
      console.error("Verification failed:", error);
      Alert.alert("Verification Error", "Failed to verify signature. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  }, [getNonce, session, setAuth, sharedSecretUint8Array]);

  const signAndSendTransaction = async () => {
    const sharedSecretUint8Array = getSharedSecretUint8Array();
    const dappKeyPair = getDappKeyPair();
    const sharedSecret = getSharedSecretUint8Array();

    if (!phantomWalletPublicKey || !connection || !session || !sharedSecretUint8Array || !dappKeyPair || !sharedSecret) {
      Alert.alert("Error", "Wallet is not fully connected or session is missing. Please reconnect.");
      return;
    }

    const message = `Authentication nonce: ${getNonce()}`;
    const payload = {
      session,
      message: bs58.encode(Buffer.from(message)),
    };
    const [nonceForSign, encryptedPayload] = encryptPayload(payload, sharedSecret);

    setIsSigningIn(true);
    try {
      const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(dappKeyPair?.publicKey),
        nonce: bs58.encode(nonceForSign),
        redirect_link: Linking.createURL("signinComplete"),
        payload: bs58.encode(encryptedPayload),
      });

      const url = buildUrl("signMessage", params);
      Linking.openURL(url);
    } catch (error) {
      console.error("Transaction failed:", error);
      Alert.alert("Transaction Error", "Failed to sign in. Please try again.");
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const sharedSecret = getSharedSecretUint8Array();
      const publicKey = getPublicKey();

      const { queryParams } = Linking.parse(url);
      const data = queryParams?.data;
      const nonce = queryParams?.nonce;
      console.log("queryParams", queryParams);
      console.log("data", data);
      console.log("nonce", nonce);
      console.log("sharedSecret", sharedSecret);
      if (!data || !nonce || !sharedSecret || !publicKey) {
        console.log("No query params found in the deep link");
        setIsSigningIn(false);
        return;
      }

      const signAndSendTransactionData = decryptPayload(
        data as string,
        nonce as string,
        sharedSecret
      );
      console.log("signAndSendTransactionData", signAndSendTransactionData);
      if (signAndSendTransactionData.signature && publicKey) {
        console.log("Transaction signature:", signAndSendTransactionData.signature);
        Alert.alert("Sign In Successful", `Transaction Signature: ${signAndSendTransactionData.signature}`);
        verifySignature(new PublicKey(publicKey), signAndSendTransactionData.signature);
        router.replace('/settings?disconnectParam=false');
      } else {
        console.log("No signature found in the response");
        Alert.alert("Transaction Error", "No signature found in the response");
        setIsSigningIn(false);
      }
    };

    const listener = Linking.addEventListener('url', handleDeepLink);
    return () => {
      listener.remove();
    };
  }, [getPublicKey, getSharedSecretUint8Array, getNonce, verifySignature]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Complete Sign In",
          headerBackTitle: "Back",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Complete Sign In</Text>
        {getPublicKey() && (
          <View style={styles.publicKeyContainer}>
            <Text style={styles.publicKeyLabel}>Signing with wallet:</Text>
            <Text style={styles.publicKeyText}>{getPublicKey()}</Text>
          </View>
        )}
        <Text style={styles.description}>Click the button below to sign and send the transaction with your Phantom wallet.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => await signAndSendTransaction()}
          disabled={isSigningIn}
        >
          <Text style={styles.buttonText}>
            {isSigningIn ? "Signing In..." : "Sign and Send Transaction"}
          </Text>
        </TouchableOpacity>
        {isSigningIn && (
          <ActivityIndicator style={styles.spinner} size="large" color="#0000ff" />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  publicKeyContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  publicKeyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  publicKeyText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#4a4a4a',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spinner: {
    marginTop: 20,
  },
});

export default SigninComplete;
