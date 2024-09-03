import { PhantomProvider } from '../../types/solana';
import { Linking } from 'react-native';

/**
 * Retrieves the Phantom Provider from the global object
 * @returns {PhantomProvider | undefined} a Phantom provider if one exists in the global scope
 */
const getProvider = (): PhantomProvider | undefined => {
  if (typeof global !== 'undefined' && 'phantom' in global) {
    const anyGlobal: any = global;
    const provider = anyGlobal.phantom?.solana;

    if (provider?.isPhantom) {
      return provider;
    }
  }

  // Open Phantom website in the device's default browser
  Linking.openURL('https://phantom.app/');
};

export default getProvider;