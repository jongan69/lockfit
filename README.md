# Welcome to Lockfit, your Expo workout app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **src-example** directory and create a blank **src** directory where you can start developing.

## Deploy the lockfitstaking program

To deploy the `lockfitstaking` program on Solana Devnet, follow these steps:

1. Set the Solana CLI to use the Devnet

   ```bash
   solana config set --url devnet
   ```

2. Build the program using Cargo

   ```bash
   cargo build-sbf
   ```

3. Request an airdrop of 1 SOL for your wallet

   ```bash
   solana airdrop 1
   ```

   Alternatively, you can use the [Solana Faucet](https://faucet.solana.com/) to request an airdrop.

4. Deploy the program

   ```bash
   solana program deploy ./target/deploy/lockfitstaking.so
   ```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
