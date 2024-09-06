use borsh::{BorshDeserialize, BorshSerialize};

// Instructions that the program can execute
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum StakingInstruction {
    Initialize { start_slot: u64, end_slot: u64 },
    Stake { amount: u64 },
    Unstake,
    ClaimReward,
}