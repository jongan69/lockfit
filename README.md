# Lockfit: Your Expo Workout App with Solana Integration 🏋️‍♂️💪

Lockfit is a comprehensive workout app built with Expo, featuring Solana blockchain integration for token staking and rewards. Our project aims to revolutionize the fitness industry by leveraging blockchain technology to incentivize users and create a more engaging workout experience.

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

## Current Development Focus and Roadmap

1. User Authentication (In Progress)
   - Implementing secure sign-in flow using Phantom wallet (app/signinComplete.tsx)
   - Integrating with backend for nonce generation and verification

2. Workout Tracking Interface (Next Sprint)
   - Designing intuitive UI for logging workouts
   - Implementing real-time data sync with Solana blockchain

3. Solana Smart Contract Development (Ongoing)
   - Finalizing staking logic in lockfitstaking program (solanaprogram/lockfitstaking/src/lib.rs)
   - Implementing reward calculation based on workout data and staked amount

4. Rewards Distribution System (Upcoming)
   - Developing a fair and motivating reward mechanism
   - Integrating with Solana program for automatic distribution

5. Performance Optimization (Continuous)
   - Refining React Native components for smooth user experience
   - Optimizing Solana transactions for cost-effectiveness

6. Social Features Integration (Future Sprint)
   - Implementing workout sharing functionality
   - Developing challenge system for user engagement

7. Analytics Dashboard (Planned)
   - Creating comprehensive performance tracking tools
   - Visualizing user progress and token earnings

## In-Depth Logic and Current Work

- User Authentication: We're utilizing Phantom wallet for secure authentication. The signinComplete.tsx file handles the sign-in process, including nonce request and signature verification.

- Solana Integration: The utils/solana directory contains helper functions for Solana transactions, including buildUrl.ts for constructing Phantom deep links.

- Smart Contract: Our Rust-based smart contract (lib.rs) defines the core logic for staking, unstaking, and reward distribution. We're currently fine-tuning the reward calculation algorithm.

- Rewards System: The rewards.tsx file in the app/(tabs) directory is being developed to display user rewards and handle claiming functionality.

## Hackathon Roadmap

Week 1:
- Complete user authentication flow
- Finalize smart contract logic for staking and rewards

Week 2:
- Develop core workout tracking features
- Integrate Solana transactions for staking and unstaking

Week 3:
- Implement rewards distribution system
- Create basic analytics dashboard

Week 4:
- Polish UI/UX
- Conduct thorough testing and bug fixes
- Prepare project presentation and documentation

## Project Impact and Business Plan

Lockfit aims to disrupt the $100 billion global fitness app market by introducing blockchain-based incentives. Our unique value proposition lies in the seamless integration of workout tracking with financial rewards, creating a powerful motivation system for users.

Business Model:
1. Freemium app with premium features unlocked by staking $LOCKFIT tokens
2. Transaction fees from reward distributions
3. Partnerships with fitness brands for sponsored challenges and rewards

Market Potential:
- Target market: 500 million global fitness app users
- Projected user base: 1 million users within the first year post-launch
- Estimated annual revenue: $10 million by Year 3

Open-Source Strategy:
We're committed to open-sourcing key components of our project to foster innovation and collaboration within the Solana ecosystem. This includes our smart contract code and core integration libraries.

## Colosseum Hackathon Submission Details

### Background
Our team consists of experienced developers, fitness enthusiasts, and blockchain experts. We're driven by the vision of creating a more engaging and rewarding fitness experience. Our diverse background in mobile development, smart contract programming, and fitness industry knowledge positions us uniquely to execute this project effectively.

### Functionality
Lockfit demonstrates high-quality code and robust functionality:
- Secure user authentication using Phantom wallet
- Efficient Solana transactions for staking and rewards
- Real-time workout tracking with blockchain integration
- Smart contract-based reward calculation and distribution

### Potential Impact
With a global fitness app market of $100 billion and 500 million users, Lockfit has immense growth potential. By introducing Solana to millions of fitness enthusiasts, we aim to significantly expand the blockchain's user base and use cases.

### Novelty
Lockfit's concept of combining fitness tracking with blockchain rewards is unique in the market. Our integration of Solana for real-time, low-cost transactions in a fitness app setting is innovative and opens new possibilities for user engagement in the health sector.

### User Experience
We leverage Solana's high-speed, low-cost transactions to create a seamless user experience. Users can stake tokens, earn rewards, and track workouts without noticeable blockchain-related delays, making the Web3 integration feel natural and user-friendly.

### Open-source Contribution
Our project is open-source, with key components available for the Solana community to use and build upon. This includes our smart contract code and Solana integration libraries, which can be valuable for other developers looking to create fitness or gamification dApps on Solana.

### Business Viability
Lockfit presents a strong business case with its freemium model, transaction fees, and potential for partnerships. The growing fitness app market and increasing interest in blockchain technology create a perfect storm for Lockfit's success and long-term viability.

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Solana Documentation](https://docs.solana.com/)

## Community

Join our [Discord](https://discord.gg/lockfit) for discussions and support.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

# DEV Notes
- App.json is where the env variables are set, React Native uses these to know which network to connect to, which RPC to use, etc.
- The env variables are set via expo, and can be accessed via `Constants.expoConfig.extra.{variable}`
