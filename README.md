# 🚀 NebulaFlick: Modern Streaming Platform

Welcome to NebulaFlick, a cutting-edge streaming platform built with Next.js, React 19, and Shaka Player that provides a seamless movie and TV show browsing and streaming experience.

**[Demo video coming soon]**

## 📋 Features

- **Rich Media Catalog**: Browse trending, popular, and top-rated movies and TV shows
- **Search Functionality**: Find your favorite content easily
- **Detailed Media Pages**: View comprehensive information about movies and TV shows
- **Video Streaming**: High-quality streaming with adaptive bitrate using Shaka Player
- **Multi-Season Support**: Browse and select seasons and episodes for TV shows
- **Mobile-Friendly Design**: Responsive interface works on all devices
- **Provider Integration**: Browse content from various streaming providers (Netflix, Disney+, Hulu, etc.)
- **Genre Filtering**: Browse content by specific genres

## 🔧 Technology Stack

- **Frontend Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with components using [Radix UI](https://www.radix-ui.com/)
- **Video Player**: [Shaka Player](https://github.com/shaka-project/shaka-player) for HLS/DASH streaming
- **Icons**: [Heroicons](https://heroicons.com/) and [Lucide React](https://lucide.dev/)
- **TypeScript**: Type-safe code throughout the application

## 📱 API Integrations

- **TMDB API**: The Movie Database API for comprehensive movie and TV show metadata
- **Torrentio**: Integration for streaming sources

## 🧩 Architecture Overview

NebulaFlick is built using a modern architecture that leverages the latest features of Next.js and React:

1. **API Layer**: 
   - `tmdb.ts`: Handles all interactions with The Movie Database API
   - `torrentio.ts`: Manages streaming source discovery and metadata

2. **Components**:
   - `ShakaPlayer.tsx`: Custom video player with adaptive streaming capabilities
   - `MovieCarousel.tsx`: Responsive carousel for displaying movies/shows
   - `StreamModal.tsx`: Modal for selecting streaming sources
   - `WatchShowModal.tsx`: UI for selecting TV show seasons and episodes

3. **Pages**:
   - Home page with featured content
   - Movie and TV show browsing pages
   - Detailed movie and show pages
   - Watch page for video playback
   - Settings page for configuration

## 🎬 Media Content

The application features a rich catalog of content including:

- **Movies**: Browse trending, popular, and top-rated movies
- **TV Shows**: Explore multi-season TV shows with episode listings
- **Provider-Specific Content**: Browse content from specific streaming services

## 📱 User Interface

- **Bottom Navigation**: Mobile-friendly navigation bar
- **Responsive Design**: Adapts to all screen sizes from mobile to desktop
- **Modern UI Components**: Using Radix UI primitives for accessible components
- **Dark Mode Design**: Sleek dark interface for better viewing experience

## 🚀 Video Playback Features

- **Adaptive Streaming**: Automatically adjusts quality based on connection speed
- **Fallback Mechanism**: Tries native player if Shaka Player encounters issues
- **Buffer Management**: Configurable buffering for smooth playback
- **Custom Controls**: Enhanced video controls for better user experience

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nebulaflick
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## 🏗️ Build and Deployment

```bash
# Build the application
npm run build
# or
yarn build

# Start the production server
npm run start
# or
yarn start
```

## 📝 Project Structure

```
app/                   # Next.js app directory
  components/          # Reusable UI components
  movie/               # Movie detail pages
  movies/              # Movie browsing pages
  show/                # TV show detail pages
  shows/               # TV show browsing pages
  search/              # Search functionality
  settings/            # User settings
  watch/               # Video playback page
  utils/               # Utility functions and API clients
    tmdb.ts            # TMDB API client
    torrentio.ts       # Streaming source integration
    genres.ts          # Genre mapping utilities
    providers.ts       # Streaming provider utilities
public/                # Static assets
```

## 🔮 Future Improvements

- User authentication and profiles
- Favorites and watch history
- Enhanced subtitle support
- More streaming providers integration
- PWA (Progressive Web App) support
- Enhanced mobile experience

## 📱 Screenshots

*Screenshots coming soon*

---

Built with ❤️ using Next.js, React, and Shaka Player
