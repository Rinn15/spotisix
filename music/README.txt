SPOTISIX - THEM NHAC MP3

1. Copy your own MP3 files into this music folder.
2. Open tracks.json in Notepad or VS Code.
3. Add one object per song inside the JSON array. Separate objects with commas.
4. Use a relative path such as "./music/my-song.mp3" for audioSrc.
5. Save tracks.json and refresh the app. No need to edit app.js.

Example entry:
{
  "title": "My Song",
  "artist": "My Artist",
  "album": "My Album",
  "duration": 205,
  "img": "album_lumina.jpg",
  "audioSrc": "./music/my-song.mp3"
}

Fields:
- title: song title (required)
- artist: artist name (required)
- album: album name
- duration: length in seconds (can be 0 if unknown)
- img: cover image path; existing album images are in the project root
- audioSrc: path to the audio file (required)

IMPORTANT:
- File names and paths must match exactly.
- Browsers cannot automatically list files in a folder, so add each song to tracks.json.
- Run the app through the Vite server (npm run dev), not by opening index.html directly.
- The ZIP does not include copyrighted music files. Add audio you own or are authorized to use.
