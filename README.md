# Notifications UI

A modern, real-time notifications management application built with Vue 3, Vuetify, and AWS Amplify. This application provides users with a centralized dashboard to view, manage, and configure their notifications with real-time updates and authentication.

## Features

- **Real-time Notifications**: Live notification updates using GraphQL subscriptions
- **User Authentication**: Secure login/logout with AWS Amplify Auth
- **Notification Management**: View, track, and manage notification history
- **Settings Panel**: Toggle notifications on/off and customize preferences
- **Responsive Design**: Modern Material Design UI with Vuetify components
- **Unread Counter**: Visual badge showing unread notification count
- **Sliding Panels**: Intuitive side panels for notifications and settings
- **GraphQL Integration**: Efficient data fetching with Apollo Client and AWS AppSync

## Tech Stack

- **Frontend**: Vue 3 (Composition API), Vuetify 3, Material Symbols
- **Backend**: AWS Amplify, AWS AppSync (GraphQL)
- **Authentication**: AWS Amplify Auth
- **Build Tool**: Vite
- **State Management**: Vue 3 Composition API with composables
- **HTTP Client**: Axios for API requests

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_KEY=your_api_key_here
VITE_GRAPHQL_ENDPOINT=your_graphql_endpoint_here
```

### AWS Amplify Setup

Ensure AWS Amplify is configured for your project:

```sh
npx amplify configure
npx amplify init
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint and Fix Files

```sh
npm run lint
```
