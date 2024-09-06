use solana_program::entrypoint;
pub use crate::process::process_instruction;

entrypoint!(process_instruction);