# 🎵 Donasong - Song Request Queue System

A modern web application for music streamer to manage song requests from donations. Built with React and TypeScript, featuring a neo-brutalist design system.

<table>
  <tr>
    <th colspan="3">Preview</th>

  </tr>
  <tr>
    <td>
      <img src="https://raw.githubusercontent.com/fadalaudzaa/donasong/refs/heads/main/screenshot/ss1.jpg" width="300">
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/fadalaudzaa/donasong/refs/heads/main/screenshot/ss2.jpg" width="300">
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/fadalaudzaa/donasong/refs/heads/main/screenshot/ss3.png" width="600">
    </td>
  </tr>
</table>

## ✨ Features

- 🎵 Simple song request system with queue management
- 🔍 Real-time song search powered by **Spotify API** (*or you can manually input the song title and artist*) 
- 🔄 Real-time queue updates with **Supabase**
- 📱 Responsive layout (*hopefully*)
- 🎨 Neo-brutalist design system
- 💰 **CAPITALIST MODE** - Donation-based queue prioritization
- 🎯 Priority handling options
- 💸 Indonesian Rupiah (IDR) currency formatting
- 🔔 Priority donation notifications
- 📺 OBS view with transparent background (*deployed as **link**/obs*)

## 🛠️ Tech Stack

### Core
- React 18
- TypeScript
- Vite
- Styled Components

### Data & State Management
- Supabase 
- React Query 
- React Router 

### APIs & Integration
- Spotify Web API

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Spotify Developer Account
- Supabase Account

### Installation

1. Clone the repository
```bash
git clone https://github.com/fadalaudzaa/donasong.git
cd donasong
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase database schema
```sql
create table songs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  artist text not null,
  cover_art text not null,
  donation_amount numeric not null,
  spotify_id text,
  timestamp timestamptz default now()
);
```

5. Start development server
```bash
npm run dev
# or
yarn dev
```

## 🎯 Usage

### Song Request Flow
1. Search for songs using Spotify integration or manual input
2. Enter donation amount
3. Submit request to join the queue

### Queue Management
- Real-time queue updates
- One-click song removal
- Bulk queue clearing

### CAPITALIST MODE (Optional)
- Enable donation-based prioritization
- Higher donations get priority placement
- Priority notifications for top donations

## 🤝 Contributing

I appreciate all contributions to the Donasong project! Whether it's bug reports, feature requests, or code contributions.

## 🙏 Shoutouts

- Spotify Web API for music data 
- Supabase for real-time capabilities 🚀
- Shoutout to AAA Clan's AAAcoustic session for the inspiration 🙌

