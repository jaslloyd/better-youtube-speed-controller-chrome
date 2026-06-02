# Better YouTube Video Speed Controller

A lightweight Chrome extension for controlling YouTube playback speed — built because existing solutions were either bloated or didn't work the way I wanted.

## Features

- Automatically sets playback speed to your preferred rate on every video
- Persists your preference across sessions and devices via Chrome sync storage
- On-page overlay with `+` / `-` controls without opening the extension
- Handles YouTube's SPA navigation — works when clicking between videos
- Popup control for setting your default speed from anywhere

## Installation

### From the Chrome Web Store

_(coming soon)_

### Local Development

1. Clone the repo
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the project folder
5. Navigate to YouTube — the extension will activate automatically

## How it works

YouTube is a Single Page Application — it doesn't do full page reloads when navigating between videos. This extension handles that in two ways:

- A `MutationObserver` watches for the video element to appear on initial load
- A `yt-navigate-finish` event listener re-applies your preferred speed on every navigation

User preferences are stored via `chrome.storage.sync`, meaning your default speed follows you across devices.

## Tech

- Vanilla JS — no frameworks or dependencies
- Chrome Extensions Manifest V3
- `chrome.storage.sync` for persistent preferences
- `MutationObserver` for async DOM handling
- `chrome.runtime.sendMessage` for popup ↔ content script communication

## Why I built this

I wanted to ship something small, focused, and useful — and learn the Chrome Extensions API properly in the process.
