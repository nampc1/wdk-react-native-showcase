# WDK React Native Worklet Showcase

This project demonstrates the integration of the Wallet Development Kit (WDK) with React Native, specifically focusing on the dynamic bundling capabilities of the `wdk-worklet-bundler`.

## Overview

The core thesis of this project is to validate dynamic bundle generation. The goal is to allow developers to specify exactly which WDK modules (e.g., specific wallets, protocols) they need. The bundler then wraps all necessary dependencies into a single, optimized bundle that runs on a separate worklet thread, communicating via HRPC.

## Getting Started

### 1. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 2. Generate the Worklet Bundle

Run the bundler to generate the worklet entry point and bundle file. The `--keep-artifacts` flag allows inspection of the generated source.

```bash
npx wdk-worklet-bundler generate --keep-artifacts --verbose
```

This process will:
- Read your WDK configuration.
- Generate the source entry file at `.wdk/wdk-worklet.generated.js`.
- Bundle dependencies into a format ready for the Bare runtime.

### 3. Run on Android

Build and launch the application on an Android emulator or device:

```bash
npm run android
```

## Project Structure

- **`.wdk/`**: Contains the generated artifacts.
  - `wdk-worklet.generated.js`: The auto-generated source file for the bundle. It imports the necessary WDK functions and registers HRPC handlers based on your configuration.
- **`wdk.config.js`**: Configuration file defining which WDK modules to include.
- **`src/`**: The React Native application source code.
