use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
    sysvar::{clock::Clock, Sysvar},
};

// Declare the program's entrypoint
entrypoint!(process_instruction);

// Program's entrypoint function
pub fn process_instruction(
    program_id: &Pubkey,      // Public key of the account the program was loaded into
    accounts: &[AccountInfo], // Accounts passed to the program
    instruction_data: &[u8],  // Input data for instructions
) -> ProgramResult {
    let instruction = StakingInstruction::try_from_slice(instruction_data)?;

    match instruction {
        StakingInstruction::Initialize {
            start_slot,
            end_slot,
        } => process_initialize(accounts, program_id, start_slot, end_slot),
        StakingInstruction::Stake { amount } => process_stake(accounts, program_id, amount),
        StakingInstruction::Unstake => process_unstake(accounts, program_id),
        StakingInstruction::ClaimReward => process_claim_reward(accounts, program_id),
    }
}

// Instructions that the program can execute
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum StakingInstruction {
    Initialize { start_slot: u64, end_slot: u64 },
    Stake { amount: u64 },
    Unstake,
    ClaimReward,
}

// Account state for the staking pool
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct PoolInfo {
    pub admin: Pubkey,
    pub start_slot: u64,
    pub end_slot: u64,
    pub token_mint: Pubkey,
    pub is_initialized: bool,
}

// Account state for a user
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserInfo {
    pub amount_staked: u64,
    pub reward_debt: u64,
    pub last_deposit_slot: u64,
    pub is_initialized: bool,
}

// Implement the Pack trait for PoolInfo and UserInfo for compatibility
impl Sealed for PoolInfo {}
impl IsInitialized for PoolInfo {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Sealed for UserInfo {}
impl IsInitialized for UserInfo {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

// Function to process the Initialize instruction
fn process_initialize(
    accounts: &[AccountInfo],
    program_id: &Pubkey,
    start_slot: u64,
    end_slot: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let admin_account = next_account_info(accounts_iter)?;
    let pool_info_account = next_account_info(accounts_iter)?;

    if pool_info_account.owner != program_id {
        msg!("Pool info account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut pool_info = PoolInfo::try_from_slice(&pool_info_account.data.borrow())?;

    if pool_info.is_initialized {
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    pool_info.admin = *admin_account.key;
    pool_info.start_slot = start_slot;
    pool_info.end_slot = end_slot;
    pool_info.is_initialized = true;

    pool_info.serialize(&mut &mut pool_info_account.data.borrow_mut()[..])?;

    msg!("Staking pool initialized!");

    Ok(())
}

// Function to process the Stake instruction
fn process_stake(accounts: &[AccountInfo], program_id: &Pubkey, amount: u64) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let user_account = next_account_info(accounts_iter)?;
    let user_info_account = next_account_info(accounts_iter)?;
    let pool_info_account = next_account_info(accounts_iter)?;
    let clock_sysvar = next_account_info(accounts_iter)?;

    if pool_info_account.owner != program_id {
        msg!("Pool info account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    let pool_info = PoolInfo::try_from_slice(&pool_info_account.data.borrow())?;

    let clock = Clock::from_account_info(clock_sysvar)?;

    let mut user_info = if user_info_account.data.borrow().is_empty() {
        UserInfo {
            amount_staked: 0,
            reward_debt: 0,
            last_deposit_slot: 0,
            is_initialized: false,
        }
    } else {
        UserInfo::try_from_slice(&user_info_account.data.borrow())?
    };

    if user_info.is_initialized && user_info.amount_staked > 0 {
        let reward = calculate_reward(
            user_info.amount_staked,
            clock.slot,
            user_info.last_deposit_slot,
            user_info.reward_debt,
        );
        msg!("Minting reward: {} tokens", reward);
    }

    user_info.amount_staked += amount;
    user_info.last_deposit_slot = clock.slot;
    user_info.reward_debt = 0;
    user_info.is_initialized = true;

    user_info.serialize(&mut &mut user_info_account.data.borrow_mut()[..])?;

    msg!("User staked {} tokens", amount);

    Ok(())
}

// Function to process the Unstake instruction
fn process_unstake(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let user_account = next_account_info(accounts_iter)?;
    let user_info_account = next_account_info(accounts_iter)?;
    let pool_info_account = next_account_info(accounts_iter)?;
    let clock_sysvar = next_account_info(accounts_iter)?;

    if pool_info_account.owner != program_id {
        msg!("Pool info account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    let pool_info = PoolInfo::try_from_slice(&pool_info_account.data.borrow())?;

    let clock = Clock::from_account_info(clock_sysvar)?;

    let mut user_info = UserInfo::try_from_slice(&user_info_account.data.borrow())?;

    let reward = calculate_reward(
        user_info.amount_staked,
        clock.slot,
        user_info.last_deposit_slot,
        user_info.reward_debt,
    );

    msg!("Minting reward: {} tokens", reward);

    msg!(
        "Transferring back {} staked tokens",
        user_info.amount_staked
    );

    user_info.amount_staked = 0;
    user_info.last_deposit_slot = 0;
    user_info.reward_debt = 0;

    user_info.serialize(&mut &mut user_info_account.data.borrow_mut()[..])?;

    Ok(())
}

// Function to process the ClaimReward instruction
fn process_claim_reward(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let user_account = next_account_info(accounts_iter)?;
    let user_info_account = next_account_info(accounts_iter)?;
    let clock_sysvar = next_account_info(accounts_iter)?;

    let clock = Clock::from_account_info(clock_sysvar)?;

    let mut user_info = UserInfo::try_from_slice(&user_info_account.data.borrow())?;

    let reward = calculate_reward(
        user_info.amount_staked,
        clock.slot,
        user_info.last_deposit_slot,
        user_info.reward_debt,
    );

    msg!("Minting reward: {} tokens", reward);

    user_info.reward_debt += reward;

    user_info.serialize(&mut &mut user_info_account.data.borrow_mut()[..])?;

    Ok(())
}

// Helper function to calculate rewards
fn calculate_reward(amount: u64, current_slot: u64, deposit_slot: u64, reward_debt: u64) -> u64 {
    (current_slot - deposit_slot) * amount - reward_debt
}

// Sanity tests
#[cfg(test)]
mod test {
    use super::*;
    use solana_program::clock::Epoch;
    use std::mem;

    #[test]
    fn test_sanity() {
        let program_id = Pubkey::default();
        let key = Pubkey::default();
        let mut lamports = 0;
        let mut data = vec![0; mem::size_of::<u32>()];
        let owner = Pubkey::default();
        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default(),
        );
        let instruction_data: Vec<u8> = Vec::new();

        let accounts = vec![account];

        assert_eq!(
            GreetingAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            0
        );
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
        assert_eq!(
            GreetingAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            1
        );
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
        assert_eq!(
            GreetingAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            2
        );
    }
}
