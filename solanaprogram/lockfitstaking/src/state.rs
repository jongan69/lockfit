use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};
use std::io::Cursor;

// Account state for the staking pool
#[derive(BorshSerialize, BorshDeserialize, Debug, Default)]
pub struct PoolInfo {
    pub admin: Pubkey,
    pub start_slot: u64,
    pub end_slot: u64,
    pub token_mint: Pubkey,
    pub is_initialized: bool,
}

impl Sealed for PoolInfo {}

impl IsInitialized for PoolInfo {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for PoolInfo {
    const LEN: usize = 97; // 32 + 8 + 8 + 32 + 1 = 97 bytes

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        Self::try_from_slice(src).map_err(|_| ProgramError::InvalidAccountData)
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        self.serialize(&mut Cursor::new(dst)).expect("Failed to pack PoolInfo");
    }
}

// Account state for a user
#[derive(BorshSerialize, BorshDeserialize, Debug, Default)]
pub struct UserInfo {
    pub amount_staked: u64,
    pub reward_debt: u64,
    pub last_deposit_slot: u64,
    pub is_initialized: bool,
}

impl Sealed for UserInfo {}

impl IsInitialized for UserInfo {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for UserInfo {
    const LEN: usize = 33; // 8 + 8 + 8 + 1 = 33 bytes

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        Self::try_from_slice(src).map_err(|_| ProgramError::InvalidAccountData)
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        self.serialize(&mut Cursor::new(dst)).expect("Failed to pack UserInfo");
    }
}
