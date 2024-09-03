# Lockfit: Your Expo Workout App with Solana Integration 🏋️‍♂️💪

Lockfit is a comprehensive workout app built with Expo, featuring Solana blockchain integration for token staking and rewards.

## Features

- Workout tracking and planning
- Solana-based token staking and rewards system
- User authentication and profile management
- Social features (workout sharing, challenges)
- Performance analytics and progress tracking

## Tech Stack

- Frontend: React Native with Expo
- Backend: Node.js
- Blockchain: Solana (Devnet)
- Smart Contract: Rust

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npx expo start
   ```

## Solana Integration

### Deploy the lockfitstaking program

1. Set Solana CLI to Devnet:
   ```bash
   solana config set --url devnet
   ```

2. Build the program:
   ```bash
   cargo build-sbf
   ```

3. Request SOL airdrop:
   ```bash
   solana airdrop 1
   ```

4. Deploy the program:
   ```bash
   solana program deploy ./target/deploy/lockfitstaking.so
   ```

## Current Development Focus

- Implementing user authentication flow
- Designing and building the workout tracking interface
- Developing the Solana smart contract for token staking
- Creating the rewards distribution system
- Optimizing app performance and UI/UX

# DEV Notes
- App.json is where the env variables are set, React Native uses these to know which network to connect to, which RPC to use, etc.
- The env variables are set via expo, and can be accessed via `Constants.expoConfig.extra.{variable}`

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Solana Documentation](https://docs.solana.com/)

## Community

Join our [Discord](https://discord.gg/lockfit) for discussions and support.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
