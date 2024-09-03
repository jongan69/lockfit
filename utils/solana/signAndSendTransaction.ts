import { Transaction } from '@solana/web3.js';

import { PhantomProvider } from '../../types/solana';

/**
 * Signs and sends transaction
 * @param   {PhantomProvider} provider    a Phantom Provider
 * @param   {Transaction}     transaction a transaction to sign
 * @returns {Transaction}                 a signed transaction
 */
const signAndSendTransaction = async (provider: PhantomProvider, transaction: Transaction): Promise<string> => {
  try {
    const { signature } = await provider.signAndSendTransaction(transaction);
    return signature;
  } catch (error: any) {
    console.warn(error);
    throw new Error(error.message);
  }
};

export default signAndSendTransaction;