# How to Run

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm install

# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

# Any External Requirement

Not required anything. for the storage i used the async storage

# Approach & Design Choice

1. Core Design - Simplicity-first approach and visual did not use any UI lib
2. Architecture - Technology stack rationale and component organization
3. Data Management - Local Storage
4. User Experience Design - Navigation Stack & Tabs Used
5. Performance Optimizations - React Native best practices

## AI Tool Used: Claude AI (Anthropic)

**Scope of AI Assistance**: Limited to design guidance and component scaffolding - **NOT full project development**

### What Claude AI Helped With:

#### 1. **Design System Guidance**
- Color palette recommendations for iOS-style interface
- Typography hierarchy suggestions
- Layout patterns for mobile adventure logging
- Visual consistency guidelines

#### 2. **Build Issue Resolution**
- Debugging React Native compilation errors
- Node.js version compatibility solutions
- iOS build configuration troubleshooting
- Dependencies and pod installation guidance

## Claude AI Interactions:
**Prompt**: *"Suggest color scheme for iOS-style adventure logging app"*
**Response**: Recommended #007AFF primary blue, consistent spacing system, iOS typography guidelines

**Prompt**: *"Help debug React Native iOS build error with missing mutex header"*
**Response**: Identified missing `#include <mutex>` in RCTPackagerConnection.mm file

**Prompt**: *"Generate React Native component structure for adventure timeline"*
**Response**: Provided TypeScript component boilerplate with props interface and basic styling