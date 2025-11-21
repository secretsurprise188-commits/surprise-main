import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Song list - numOfDays songs total
// Last song (song numOfDays) will play ON the deadline day (at celebration)
// First song unlocks when less than numOfDays days remain (daysRemaining < numOfDays)
// Format: { id: number, title: 'Song Title', artist: 'Artist Name', url: 'song-url-here', lyrics: 'lyrics-here' }
// Note: For YouTube Music URLs, they will be embedded. For direct audio playback, use MP3/MP4 URLs.
const SONGS_LIST = [
  { id: 1, title: 'Ya Aashikata El Wardi', url: 'https://music.youtube.com/watch?v=dDIyA7Gk7kY' },
  { id: 2, title: 'Habibty Malak', url: 'https://music.youtube.com/watch?v=qD_O19z1I3s' },
  { id: 3, title: 'Koun', url: 'https://music.youtube.com/watch?v=RPspk7dn6Bs' },
  { id: 4, title: 'Ana La Habibi', url: 'https://music.youtube.com/watch?v=5UAMf21kPk4' },
  { id: 5, title: 'BETEWHASHEINY', url: 'https://music.youtube.com/watch?v=wzKEejABhKI' },
  { id: 6, title: 'Lama Tkooni', url: 'https://music.youtube.com/watch?v=m64Vu9zQgv8' },
  { id: 7, title: 'Sabran', url: 'https://music.youtube.com/watch?v=2NhTlnSRYos' },
  { id: 8, title: 'Kol Sana', url: 'https://music.youtube.com/watch?v=wNut8QshEx0' },
  // { id: 8, title: 'بيكلموني', url: 'https://music.youtube.com/watch?v=3AIj4sov72c' },
  // { id: 9, title: 'Men Yawmeta', url: 'https://music.youtube.com/watch?v=LPPZ-wDyTrk' },
  // { id: 10, title: 'Ya Ana Ya Ana', url: 'https://music.youtube.com/watch?v=uI69hppld40' },
  // { id: 11, title: 'Koul Waad', url: 'https://music.youtube.com/watch?v=8sbWhSQ9Dx4' },
  // { id: 12, title: 'Khodni', url: 'https://music.youtube.com/watch?v=vQN9_G9Cu5w' },
  // { id: 13, title: 'Meen Gheirak Fe El-Alb', url: 'https://music.youtube.com/watch?v=kmYG2gNXu0o' },
  // { id: 14, title: 'Ashanek', url: 'https://music.youtube.com/watch?v=iLJsLFGsp9U' },
  // { id: 15, title: 'Bel Ahlam', url: 'https://music.youtube.com/watch?v=FEcfZ3a6mcM' },
  // { id: 16, title: 'Maleket Gamal El Kon', url: 'https://music.youtube.com/watch?v=mUC-Um5Jauw' },
  // { id: 17, title: 'MILLION AHEBEK', url: 'https://music.youtube.com/watch?v=Pu_bYZ9WQBQ&list=OLAK5uy_lxHVRiEALAEq9KuIhss1RPKAX-T2_qwwE' },
  // TODO: Add your songs above (uncomment and fill in)
]

// Music Player Component
function MusicPlayer({ daysRemaining, numOfDays }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedSongIndex, setSelectedSongIndex] = useState(null) // Track which song is selected for playback
  const [showLyrics, setShowLyrics] = useState(false) // Track lyrics visibility
  const audioRef = useRef(new Audio())
  const songs = SONGS_LIST

  // Calculate unlocked songs based on days remaining
  // Unlock logic (shifted back by 1 day):
  //   - First song: daysRemaining < numOfDays (1 song) - when less than numOfDays days remain
  //   - Second song: daysRemaining < 17 (2 songs total) - when less than 17 days remain
  //   - Third song: daysRemaining < 16 (3 songs total) - when less than 16 days remain
  //   - ... continue pattern
  //   - 17th song: daysRemaining < 2 (17 songs total) - when less than 2 days remain
  //   - numOfDaysth song (last): daysRemaining <= 0 (numOfDays songs, at celebration)
  const getUnlockedSongs = () => {
    if (songs.length === 0) return []
    if (daysRemaining === null || daysRemaining === undefined) return []
    
    // If past deadline or at celebration, all songs unlocked
    if (daysRemaining <= 0) return songs
    
    // If numOfDays or more days remaining, no songs unlocked
    if (daysRemaining >= numOfDays) return []
    
    // Calculate how many songs are unlocked
    // Formula: unlockedCount = Math.min(numOfDays-1, numOfDays - Math.floor(daysRemaining))
    const unlockedCount = Math.min(numOfDays-1, numOfDays - Math.floor(daysRemaining))
    
    // Cap at total number of songs
    return songs.slice(0, Math.min(unlockedCount, songs.length))
  }

  // Calculate which song is "today's song" (the most recently unlocked)
  const getCurrentSongIndex = () => {
    const unlocked = getUnlockedSongs()
    if (unlocked.length === 0) return -1
    // Return the index of the last unlocked song (most recent)
    return unlocked.length - 1
  }

  const currentTrackIndex = getCurrentSongIndex()
  const currentSong = currentTrackIndex >= 0 && currentTrackIndex < songs.length ? songs[currentTrackIndex] : null
  const unlockedSongs = getUnlockedSongs()
  const remainingSurpriseSongs = Math.max(0, songs.length - unlockedSongs.length)

  // Determine which song to play: selected song or today's song
  const songToPlay = selectedSongIndex !== null 
    ? (selectedSongIndex >= 0 && selectedSongIndex < songs.length ? songs[selectedSongIndex] : null)
    : currentSong

  // Check if URL is a YouTube/YouTube Music URL
  const isYouTubeUrl = (url) => {
    if (!url) return false
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com')
  }

  // Extract video ID from YouTube URL
  const extractYouTubeId = (url) => {
    if (!url) return null
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([^"&?\/\s]{11})/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  const youtubeVideoId = songToPlay?.url ? extractYouTubeId(songToPlay.url) : null
  const isYouTube = songToPlay?.url ? isYouTubeUrl(songToPlay.url) : false

  // Load the selected song or today's song
  useEffect(() => {
    const audio = audioRef.current
    if (songToPlay?.url && !isYouTube) {
      // Only load non-YouTube URLs in audio element
      audio.src = songToPlay.url
      audio.load()
      // If a different song was selected, stop current playback
      if (isPlaying && selectedSongIndex !== null && selectedSongIndex !== currentTrackIndex) {
        setIsPlaying(false)
      }
    } else if (isYouTube) {
      // For YouTube URLs, don't use audio element
      audio.src = ''
      audio.load()
    } else {
      audio.src = ''
      audio.load()
      setIsPlaying(false)
    }
    
    // Cleanup function
    return () => {
      // Don't pause here, let user control playback
    }
  }, [selectedSongIndex, songToPlay?.url, currentTrackIndex, isPlaying, isYouTube])

  // Handle song ended - don't auto-play next, just stop
  useEffect(() => {
    const audio = audioRef.current
    const handleEnded = () => {
      setIsPlaying(false)
    }
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const handlePlayPause = () => {
    if (isYouTube) {
      // For YouTube, toggle play state (iframe will handle playback)
      setIsPlaying(!isPlaying)
      if (!isPlaying && songToPlay?.lyrics) {
        setShowLyrics(true)
      }
    } else {
      const audio = audioRef.current
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        if (songToPlay?.url) {
          audio.play().then(() => {
            setIsPlaying(true)
            // Auto-show lyrics when song starts playing
            if (songToPlay?.lyrics) {
              setShowLyrics(true)
            }
          }).catch((error) => {
            console.log('Play error:', error)
          })
        }
      }
    }
  }

  const handlePlaySong = (songIndex) => {
    setSelectedSongIndex(songIndex)
    const selectedSong = songs[songIndex]
    const isSelectedYouTube = selectedSong?.url ? isYouTubeUrl(selectedSong.url) : false
    
    if (isSelectedYouTube) {
      // For YouTube, just set playing state
      setIsPlaying(true)
      if (selectedSong?.lyrics) {
        setShowLyrics(true)
      }
    } else {
      // Auto-play the selected song
      setTimeout(() => {
        const audio = audioRef.current
        if (audio.src) {
          audio.play().then(() => {
            setIsPlaying(true)
            // Auto-show lyrics when song starts playing
            if (selectedSong?.lyrics) {
              setShowLyrics(true)
            }
          }).catch((error) => {
            console.log('Play error:', error)
          })
        }
      }, 100)
    }
  }

  const handlePlayTodaySong = () => {
    setSelectedSongIndex(null) // Reset to today's song
    if (isYouTube) {
      setIsPlaying(true)
      if (currentSong?.lyrics) {
        setShowLyrics(true)
      }
    } else {
      setTimeout(() => {
        const audio = audioRef.current
        if (audio.src) {
          audio.play().then(() => {
            setIsPlaying(true)
            // Auto-show lyrics when song starts playing
            if (currentSong?.lyrics) {
              setShowLyrics(true)
            }
          }).catch((error) => {
            console.log('Play error:', error)
          })
        }
      }, 100)
    }
  }

  // Show message if songs haven't started yet
  if (songs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="music-player"
      >
        <div className="music-player-container">
          <div className="music-player-info">
            <div className="music-player-track">
              <div className="track-name">No songs added yet</div>
              <div className="track-artist">Add songs to the SONGS_LIST in the source code</div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Show message if songs haven't started yet (too early)
  if (daysRemaining === null || daysRemaining === undefined) {
    return null
  }

  // Always show the playlist, even if no songs unlocked yet
  if (daysRemaining >= numOfDays) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="music-player"
      >
        <div className="music-player-container">
          <div className="music-player-info">
            <div className="music-player-track">
              {/* <div className="track-name">Songs will start when less than 18 days remain</div> */}
              {/* <div className="track-artist">First song unlocks when {Math.ceil(daysRemaining)} days remain</div> */}
            </div>
          </div>
          {/* Show locked playlist */}
          {songs.length > 0 && (
            <div className="played-songs-box">
              <div className="played-songs-title">
                📜 Playlist ({0} / {songs.length} unlocked)
              </div>
              <div className="played-songs-list">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="played-song-item locked"
                    title="🔒 Locked - Coming soon"
                  >
                    <span className="played-song-number">🔒</span>
                    <span className="played-song-name">🔒 Locked</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Show player with unlocked songs
  if (unlockedSongs.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="music-player"
    >
      <div className="music-player-container">
        <div className="music-player-info">
          <div className="music-player-title">
            {selectedSongIndex !== null && selectedSongIndex !== currentTrackIndex 
              ? '🎵 Playing from Playlist' 
              : '🎵 Today\'s Song'}
          </div>
          <div className="music-player-day-info">
            {selectedSongIndex !== null && selectedSongIndex !== currentTrackIndex 
              ? `Day ${selectedSongIndex + 1} (Replay)`
              : currentTrackIndex >= 0
                ? `Song ${currentTrackIndex + 1} of ${songs.length} - ${unlockedSongs.length} unlocked`
                : daysRemaining >= numOfDays
                  ? `Are you ready for what is coming?`
                  : 'All songs unlocked!'}
          </div>
          {songToPlay && (
            <div className="music-player-track">
              <div className="track-name">{songToPlay.title}</div>
              <div className="track-artist">{songToPlay.artist}</div>
            </div>
          )}
        </div>
        <div className="music-player-controls">
          <button onClick={handlePlayPause} className="control-btn play-pause-btn">
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          {selectedSongIndex !== null && selectedSongIndex !== currentTrackIndex && (
            <button onClick={handlePlayTodaySong} className="control-btn today-btn" title="Play Today's Song">
              📅
            </button>
          )}
          {songToPlay?.lyrics && (
            <button 
              onClick={() => setShowLyrics(!showLyrics)} 
              className="control-btn lyrics-btn" 
              title={showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
            >
              📝
            </button>
          )}
        </div>

        {/* YouTube Player (for YouTube/YouTube Music URLs) */}
        {isYouTube && youtubeVideoId && (
          <div className="youtube-player-container">
            <div className="youtube-player-wrapper">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=${isPlaying ? 1 : 0}&controls=1&rel=0`}
                title={songToPlay?.title || 'YouTube Player'}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="youtube-iframe"
              ></iframe>
            </div>
            <div className="youtube-note">
              💡 Note: YouTube Music URLs are embedded here. For direct audio playback, use a direct MP3/MP4 URL.
            </div>
          </div>
        )}

        {/* Lyrics Display */}
        {showLyrics && songToPlay?.lyrics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lyrics-container"
          >
            <div className="lyrics-header">
              <span className="lyrics-title">📝 Lyrics</span>
              <button 
                onClick={() => setShowLyrics(false)} 
                className="lyrics-close-btn"
                title="Close Lyrics"
              >
                ✕
              </button>
            </div>
            <div className="lyrics-content">
              {songToPlay.lyrics.split('\n').map((line, index) => (
                <p key={index} className="lyrics-line">
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Unlocked Songs Playlist - Compact Box */}
        {songs.length > 0 && (
          <div className="played-songs-box">
            <div className="played-songs-title">
              📜 Playlist ({unlockedSongs.length} / {songs.length} unlocked)
            </div>
            <div className="played-songs-list">
              {songs.map((song, index) => {
                const isUnlocked = index < unlockedSongs.length
                const isSelected = selectedSongIndex === index
                const isToday = index === currentTrackIndex
                
                return (
                  <div
                    key={song.id}
                    className={`played-song-item ${!isUnlocked ? 'locked' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => isUnlocked && handlePlaySong(index)}
                    title={isUnlocked ? `Song ${index + 1}: ${song.title}` : '🔒 Locked - Coming soon'}
                  >
                    <span className="played-song-number">
                      {isUnlocked ? index + 1 : '🔒'}
                    </span>
                    <span className="played-song-name">
                      {isUnlocked ? song.title : '🔒 Locked'}
                    </span>
                    {isToday && isUnlocked && <span className="played-song-badge">Today</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Today's Song Info - Hidden future songs */}
        <div className="music-player-schedule">
          <div className="schedule-title">Today's Song</div>
          {currentSong && (
            <div className="schedule-item today flex flex-col">
              <span className="schedule-day">Song {currentTrackIndex + 1}</span>
              <span className="schedule-song">{currentSong.title}</span>
              <span className="schedule-status">🎵 Playing Today</span>
            </div>
          )}
          {remainingSurpriseSongs > 0 && (
            <div className="schedule-note">
              {remainingSurpriseSongs} surprise song{remainingSurpriseSongs !== 1 ? 's' : ''} coming soon! 🎁
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default MusicPlayer

