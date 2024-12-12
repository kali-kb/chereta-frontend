# Chereta Live Auction Frontend

A real-time auction frontend application built to interface with an Elixir/Phoenix backend. This application enables users to participate in live auctions with real-time updates and bidding capabilities.

## Features

- Real-time auction updates using WebSocket connections
- Live bidding functionality 
- Current price and time remaining displays
- Track Presence of users bidding on an item in real-time
- Auction item details and image galleries
- Bid history tracking
- Responsive design for desktop and mobile devices

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A running instance of the Elixir/Phoenix auction backend

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/live-auction-frontend.git
cd live-auction-frontend
```

2. Install dependencies:
```bash 
npm install
# or
yarn install
```

3. Configure environment variables:
Create a `.env` file in the root directory and add:
```env
REACT_APP_API_URL=your_backend_url
REACT_APP_WS_URL=your_websocket_url
```

4. Start the development server:
```bash
npm start
# or 
yarn start
```

## Connecting to the Backend

This frontend is designed to work with an Elixir/Phoenix backend. Make sure your backend server is running and the WebSocket connection is properly configured in the environment variables.

## Technology Stack

- React.js for UI components
- Redux for state management
- Phoenix Channels for WebSocket communication
- Styled Components for styling
- Axios for HTTP requests
