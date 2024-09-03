import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { createThemedStyles } from '@/styles/theme';
import { fetchAndUpdateBalance, handleClaimRewards } from '@/utils/rewardsUtils';
import Constants from 'expo-constants';
import { useUserStore } from '@/stores/UserStore';

const Rewards = () => {
  const {
    publicKey,
    workoutData,
    stakedBalance,
    updateStakedBalance,
    updateRewardsBalance,
  } = useUserStore();
  const [rewards, setRewards] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const { isDarkMode } = useTheme() || { isDarkMode: false };
  const styles = createThemedStyles(isDarkMode);

  useEffect(() => {
    if (publicKey) {
      fetchAndUpdateBalance(publicKey, updateStakedBalance);
    }
  }, [publicKey, updateStakedBalance]);

  useEffect(() => {
    if (stakedBalance > 0) {
      const totalWorkoutMinutes = workoutData.reduce((acc, workout) => acc + workout.duration, 0);
      const baseRewards = stakedBalance * 0.01;
      const workoutMultiplier = 1 + (totalWorkoutMinutes / 60) * 0.1;
      setMultiplier(workoutMultiplier);
      setRewards(baseRewards * workoutMultiplier);
    } else {
      setRewards(0);
      setMultiplier(1);
    }
  }, [workoutData, stakedBalance]);

  const renderContent = () => {
    if (!publicKey) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Please sign in to view your rewards.</Text>
        </View>
      );
    }

    if (stakedBalance <= 0) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>You need to stake SOL to earn rewards.</Text>
        </View>
      );
    }

    return (
      <>
        <View style={[styles.card, styles.rewardsCard]}>
          <Text style={styles.cardTitle}>Total Rewards</Text>
          <Text style={styles.rewardAmount}>{rewards.toFixed(4)} $LOCKIN</Text>
          <Text style={styles.multiplierText}>Workout Multiplier: x{multiplier.toFixed(2)}</Text>
          <Image 
            source={require('@/assets/images/react-logo.png')} 
            style={styles.stakeImage}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Workout Activity</Text>
          {workoutData.map((workout, index) => (
            <View key={index} style={styles.workoutCard}>
              <Text style={styles.workoutDate}>{workout.date}</Text>
              <Text style={styles.workoutText}>Duration: {workout.duration} mins</Text>
              <Text style={styles.workoutText}>Type: {workout.type}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.rewardsButton} 
          onPress={() => handleClaimRewards(rewards, setRewards, updateRewardsBalance)}
          disabled={rewards <= 0}
        >
          <Text style={styles.buttonText}>Claim Rewards</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Workout Rewards Dashboard</Text>
        <Text>RPC Url: {Constants?.expoConfig?.extra?.rpcUrl}</Text>
      </View>
      {renderContent()}
    </ScrollView>
  );
}

export default Rewards;
