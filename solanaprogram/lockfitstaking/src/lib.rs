mod entrypoint;
mod errors;
mod state;
mod instructions;
mod process;

pub use entrypoint::process_instruction;
pub use errors::StakingError;
pub use state::{PoolInfo, UserInfo};
pub use instructions::StakingInstruction;
