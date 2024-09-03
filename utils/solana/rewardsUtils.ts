import Constants from 'expo-constants';

export const fetchAndUpdateBalance = async (publicKey: string, updateStakedBalance: (balance: number) => void) => {
  try {
    const response = await fetch(`${Constants?.expoConfig?.extra?.rpcUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getBalanceByPublicKey',
        params: {
          publicKey: publicKey,
        },
      }),
    });
    const { result } = await response.json();
    console.log(result)
    updateStakedBalance(result.balance);
  } catch (error) {
    console.error('Failed to fetch balance:', error);
  }
};

export const simulateStakingRewards = (stakedAmount: number, setRewards: (rewards: number) => void) => {
  const interval = setInterval(() => {
    const rewards = stakedAmount * 0.0001; // Example reward calculation
    setRewards(rewards);
  }, 10000); // Update rewards every 10 seconds

  return interval;
};

export const handleStake = (
  stakeInput: string, 
  setStakedAmount: React.Dispatch<React.SetStateAction<number>>, 
  setStakeInput: (input: string) => void
) => {
  const amount = parseFloat(stakeInput);
  if (!isNaN(amount) && amount > 0) {
    setStakedAmount((prev: number) => prev + amount);
    setStakeInput('');
  } else {
    console.error('Invalid stake amount');
  }
};

export const handleUnstake = (setStakedAmount: (amount: number) => void, setRewards: (rewards: number) => void) => {
  setStakedAmount(0);
  setRewards(0);
};

export const handleClaimRewards = (rewards: number, setRewards: (rewards: number) => void, updateRewardsBalance?: (balance: number) => void) => {
  if (rewards > 0) {
    console.log(`Claimed ${rewards.toFixed(4)} SOL`);
    setRewards(0);
    if (updateRewardsBalance) {
      updateRewardsBalance(rewards);
    }
  } else {
    console.error('No rewards to claim');
  }
};
