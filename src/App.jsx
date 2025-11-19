import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import Messages from './components/Messages'
import MusicPlayer from './components/MusicPlayer'
import Gallery from './components/Gallery'


// Example password - you can change this
const PASSWORD = '212'
const BIRTHDAY_PERSON = 'NEMO' // Change this to the person's name
const numOfDays=8

// Calculate target date for November 27th (current year or next year if date has passed)
const getTargetDate = () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const targetDate = new Date(`${currentYear}-11-19T00:00:00`)
  
  // If November 27th has passed this year, use next year
//   if (targetDate < now) {
//     return new Date(`${currentYear + 1}-11-27T00:00:00`).getTime()
//   }
  
  return targetDate.getTime()
}

const TARGET_DATE = getTargetDate()

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

  
  
  { id: 8, title: 'بيكلموني', url: 'https://music.youtube.com/watch?v=3AIj4sov72c' },

  
  
  // { id: 9, title: 'Men Yawmeta', url: 'https://music.youtube.com/watch?v=LPPZ-wDyTrk' },
  
  // { id: 10, title: 'Ya Ana Ya Ana', url: 'https://music.youtube.com/watch?v=uI69hppld40' },

  
  // { id: 11, title: 'Koul Waad', url: 'https://music.youtube.com/watch?v=8sbWhSQ9Dx4' },

  
  // { id: 12, title: 'Khodni', url: 'https://music.youtube.com/watch?v=vQN9_G9Cu5w' },


  // { id: 13, title: 'Meen Gheirak Fe El-Alb', url: 'https://music.youtube.com/watch?v=kmYG2gNXu0o' },
  

  // { id: 14, title: 'Ashanek', url: 'https://music.youtube.com/watch?v=iLJsLFGsp9U' },
  

  // { id: 15, title: 'Bel Ahlam', url: 'https://music.youtube.com/watch?v=FEcfZ3a6mcM' },
  

  // { id: 16, title: 'Maleket Gamal El Kon', url: 'https://music.youtube.com/watch?v=mUC-Um5Jauw' },

  // { id: 17, title: 'MILLION AHEBEK', url: 'https://music.youtube.com/watch?v=Pu_bYZ9WQBQ&list=OLAK5uy_lxHVRiEALAEq9KuIhss1RPKAX-T2_qwwE' },

  // { id: 18, title: 'Kol Sana', url: 'https://music.youtube.com/watch?v=wNut8QshEx0' },

  
  // TODO: Add your 18 songs above (uncomment and fill in)
]

// Messages list - numOfDays messages total
// Last message (message numOfDays) will appear ON the deadline day (at celebration)
// First message appears when less than numOfDays days remain (daysRemaining < numOfDays)
// Format: { id: number, message: 'Your message text here' }
const MESSAGES_LIST = [
  { id: 1, message: 'Day 1: The countdown begins! Something special is coming...' },
  { id: 2, message: 'Day 2: Every day brings us closer to something amazing!' },
  { id: 3, message: 'Day 3: The anticipation is building...' },
  { id: 4, message: 'Day 4: Each moment is a step closer to the surprise!' },
  { id: 5, message: 'Day 5: The excitement grows with every passing day!' },
  { id: 6, message: 'Day 6: Halfway there, and the best is yet to come!' },
  { id: 7, message: 'Day 7: A week closer to something wonderful!' },
  { id: 8, message: 'Day 8: The journey continues, full of surprises!' },
  // { id: 9, message: 'Day 9: Every day is a new chapter in this story!' },
  // { id: 10, message: 'Day 10: The countdown is getting exciting!' },
  // { id: 11, message: 'Day 11: Almost there, something amazing awaits!' },
  // { id: 12, message: 'Day 12: The final days are approaching!' },
  // { id: 13, message: 'Day 13: Just a few more days to go!' },
  // { id: 14, message: 'Day 14: The excitement is reaching its peak!' },
  // { id: 15, message: 'Day 15: Almost time for the big reveal!' },
  // { id: 16, message: 'Day 16: The final countdown begins!' },
  // { id: 17, message: 'Day 17: Tomorrow is the day!' },
  // { id: 18, message: 'Day 18: Today is the day! Happy Birthday! 🎉🎂🎈' },
  // TODO: Add your messages above (you can customize each message)
]

// Messages Component
// function Messages({ daysRemaining }) {
//   const messages = MESSAGES_LIST
//   const [selectedMessageId, setSelectedMessageId] = useState(null)
//   const [revealedMessages, setRevealedMessages] = useState(new Set())

//   // Calculate unlocked messages based on days remaining
//   // Same unlock logic as songs:
//   //   - First message: daysRemaining < numOfDays (1 message) - when less than numOfDays days remain
//   //   - Second message: daysRemaining < 17 (2 messages total) - when less than 17 days remain
//   //   - ... continue pattern
//   //   - numOfDaysth message (last): daysRemaining <= 0 (numOfDays messages, at celebration)
//   const getUnlockedMessages = () => {
//     if (messages.length === 0) return []
//     if (daysRemaining === null || daysRemaining === undefined) return []
    
//     // If past deadline or at celebration, all messages unlocked
//     if (daysRemaining <= 0) return messages
    
//     // If numOfDays or more days remaining, no messages unlocked
//     if (daysRemaining >= numOfDays) return []
    
//     // Calculate how many messages are unlocked
//     // Formula: unlockedCount = Math.min(numOfDays-1, numOfDays - Math.floor(daysRemaining))
//     const unlockedCount = Math.min(numOfDays-1, numOfDays - Math.floor(daysRemaining))
    
//     // Cap at total number of messages
//     return messages.slice(0, Math.min(unlockedCount, messages.length))
//   }

//   const unlockedMessages = getUnlockedMessages()
//   const remainingMessages = Math.max(0, messages.length - unlockedMessages.length)

//   // Get today's message (the latest unlocked message)
//   const getTodayMessage = () => {
//     if (unlockedMessages.length === 0) return null
//     return unlockedMessages[unlockedMessages.length - 1]
//   }

//   const todayMessage = getTodayMessage()
  
//   // Get the currently displayed message (selected or today's)
//   const displayedMessage = selectedMessageId 
//     ? unlockedMessages.find(msg => msg.id === selectedMessageId) || todayMessage
//     : todayMessage

//   // Check if current message is revealed
//   const isMessageRevealed = displayedMessage ? revealedMessages.has(displayedMessage.id) : false

//   // Handle cover click to reveal message
//   const handleRevealMessage = () => {
//     if (displayedMessage) {
//       setRevealedMessages(prev => new Set([...prev, displayedMessage.id]))
//     }
//   }

//   // Reset reveal when message changes (optional - remove if you want covers to stay revealed)
//   useEffect(() => {
//     // Auto-reveal today's message after a short delay
//     if (todayMessage && !selectedMessageId && !revealedMessages.has(todayMessage.id)) {
//       // You can remove this auto-reveal if you want manual reveal only
//     }
//   }, [todayMessage, selectedMessageId, revealedMessages])

//   // Always show the messages section, even if no messages unlocked yet
//   if (daysRemaining >= numOfDays) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-[600px] mx-auto my-8 px-4 md:my-6 md:px-2"
//       >
//         <div className="text-2xl md:text-xl text-white/90 font-bold mb-6 md:mb-4 tracking-wide text-center">Daily Messages</div>
//         <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-[15px] p-8 border-2 border-white/10 text-center">
//           <p className="text-white/60 text-base italic">Messages will start appearing as the countdown progresses!</p>
//         </div>
//       </motion.div>
//     )
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="w-full max-w-[600px] mx-auto my-8 px-4 md:my-6 md:px-2"
//     >
//       <div className="text-2xl md:text-xl text-white/90 font-bold mb-6 md:mb-4 tracking-wide text-center">
//         Daily Messages
//         {remainingMessages > 0 && (
//           <span className="text-sm text-white/60 font-normal ml-2">({remainingMessages} more to come)</span>
//         )}
//       </div>
      
//       {/* Today's Message Display */}
//       {displayedMessage && (
//         <motion.div
//           key={displayedMessage.id}
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="bg-gradient-to-br from-[#2a2a1a] to-[#3a3a2a] rounded-[15px] p-8 md:p-6 border-2 border-yellow-500/50 shadow-[0_6px_24px_rgba(255,215,0,0.2)] mb-6 relative overflow-hidden min-h-[200px] flex items-center justify-center"
//         >
//           {/* Message Cover */}
//           {!isMessageRevealed && (
//             <motion.div
//               initial={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8, rotate: -5 }}
//               transition={{ duration: 0.5 }}
//               onClick={handleRevealMessage}
//               className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-indigo-900/90 backdrop-blur-sm cursor-pointer z-10 flex flex-col items-center justify-center p-8 group"
//             >
//               {/* Decorative Elements */}
//               <div className="absolute inset-0 overflow-hidden">
//                 {[...Array(20)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className="absolute w-2 h-2 rounded-full bg-white/20"
//                     style={{
//                       left: `${Math.random() * 100}%`,
//                       top: `${Math.random() * 100}%`,
//                     }}
//                     animate={{
//                       y: [0, -30, 0],
//                       opacity: [0.2, 0.8, 0.2],
//                       scale: [1, 1.5, 1],
//                     }}
//                     transition={{
//                       duration: 3 + Math.random() * 2,
//                       repeat: Infinity,
//                       delay: Math.random() * 2,
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* Sparkle Effect */}
//               <div className="absolute inset-0">
//                 {[...Array(8)].map((_, i) => (
//                   <motion.div
//                     key={`sparkle-${i}`}
//                     className="absolute w-1 h-1 bg-yellow-300 rounded-full"
//                     style={{
//                       left: `${20 + (i * 10)}%`,
//                       top: `${20 + (i % 4) * 20}%`,
//                     }}
//                     animate={{
//                       scale: [0, 1, 0],
//                       opacity: [0, 1, 0],
//                       rotate: 360,
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       delay: i * 0.3,
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* Main Content */}
//               <motion.div
//                 animate={{ scale: [1, 1.05, 1] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//                 className="relative z-10 text-center"
//               >
//                 <div className="text-6xl md:text-5xl mb-4">🎁</div>
//                 <div className="text-2xl md:text-xl font-bold text-white/90 mb-3 tracking-wide">
//                   A Special Message Awaits
//                 </div>
//                 <div className="text-base md:text-sm text-white/70 mb-6 font-medium">
//                   Click to reveal your message
//                 </div>
//                 <motion.div
//                   animate={{ y: [0, -5, 0] }}
//                   transition={{ duration: 1.5, repeat: Infinity }}
//                   className="text-3xl"
//                 >
//                   👆
//                 </motion.div>
//               </motion.div>

//               {/* Shimmer Effect */}
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
//                 animate={{
//                   x: ['-100%', '200%'],
//                 }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   repeatDelay: 1,
//                 }}
//               />
//             </motion.div>
//           )}

//           {/* Message Content */}
//           {isMessageRevealed && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="w-full"
//             >
//               <div className="text-sm text-yellow-400/80 font-semibold mb-3 uppercase tracking-wider">
//                 {selectedMessageId === todayMessage?.id || !selectedMessageId ? "Today's Message" : `Day ${displayedMessage.id} Message`}
//               </div>
//               <div className="text-lg md:text-base text-white/95 leading-relaxed font-normal">
//                 {displayedMessage.message}
//               </div>
//             </motion.div>
//           )}
//         </motion.div>
//       )}

//       {/* Messages List */}
//       <div className="flex flex-col gap-3">
//         <div className="text-sm text-white/70 font-semibold mb-2 uppercase tracking-wide">All Messages</div>
//         {unlockedMessages.map((message, index) => {
//           const isSelected = selectedMessageId === message.id || (!selectedMessageId && index === unlockedMessages.length - 1)
//           return (
//             <motion.button
//               key={message.id}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: index * 0.05 }}
//               onClick={() => {
//                 setSelectedMessageId(message.id)
//                 // Cover will automatically show if message hasn't been revealed
//               }}
//               className={`w-full text-left bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-[12px] p-4 md:p-3 border-2 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
//                 isSelected 
//                   ? 'border-yellow-500/70 bg-gradient-to-br from-[#2a2a1a] to-[#3a3a2a] shadow-md' 
//                   : 'border-white/10'
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="text-sm font-semibold text-white/80">Day {message.id}</div>
//                 {isSelected && (
//                   <div className="text-yellow-400 text-xs">●</div>
//                 )}
//               </div>
//             </motion.button>
//           )
//         })}
        
//         {remainingMessages > 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-[12px] p-4 md:p-3 border-2 border-dashed border-white/10 shadow-lg opacity-60"
//           >
//             <div className="text-sm text-white/50 italic text-center leading-relaxed font-normal">
//               🔒 {remainingMessages} more message{remainingMessages > 1 ? 's' : ''} will unlock as the countdown continues...
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </motion.div>
//   )
// }

// Music Player Component
// function MusicPlayer({ daysRemaining }) {
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [selectedSongIndex, setSelectedSongIndex] = useState(null) // Track which song is selected for playback
//   const [showLyrics, setShowLyrics] = useState(false) // Track lyrics visibility
//   const audioRef = useRef(new Audio())
//   const songs = SONGS_LIST

//   // Calculate unlocked songs based on days remaining
//   // Unlock logic (shifted back by 1 day):
//   //   - First song: daysRemaining < numOfDays (1 song) - when less than numOfDays days remain
//   //   - Second song: daysRemaining < 17 (2 songs total) - when less than 17 days remain
//   //   - Third song: daysRemaining < 16 (3 songs total) - when less than 16 days remain
//   //   - ... continue pattern
//   //   - 17th song: daysRemaining < 2 (17 songs total) - when less than 2 days remain
//   //   - numOfDaysth song (last): daysRemaining <= 0 (numOfDays songs, at celebration)
//   const getUnlockedSongs = () => {
//     if (songs.length === 0) return []
//     if (daysRemaining === null || daysRemaining === undefined) return []
    
//     // If past deadline or at celebration, all songs unlocked
//     if (daysRemaining <= 0) return songs
    
//     // If 18 or more days remaining, no songs unlocked
//     if (daysRemaining >= numOfDays) return []
    
//     // Calculate how many songs are unlocked
//     // Pattern (shifted back by 1 day):
//     // - daysRemaining < 18: 1 song (first song)
//     // - daysRemaining < 17: 2 songs (first + second)
//     // - daysRemaining < 16: 3 songs (first + second + third)
//     // - ...
//     // - daysRemaining < 2: 17 songs (17th song)
//     // - daysRemaining < 1: 17 songs (still 17, 18th unlocks at celebration)
//     // - daysRemaining <= 0: 18 songs (handled by early return above)
//     // Formula: unlockedCount = Math.min(17, 18 - Math.floor(daysRemaining))
//     // This ensures:
//     // - daysRemaining = 17.5: Math.floor(17.5) = 17, so min(17, 18-17) = min(17, 1) = 1 song ✓
//     // - daysRemaining = 17.0: Math.floor(17.0) = 17, so min(17, 18-17) = min(17, 1) = 1 song ✓
//     // - daysRemaining = 16.5: Math.floor(16.5) = 16, so min(17, 18-16) = min(17, 2) = 2 songs ✓
//     // - daysRemaining = 16.0: Math.floor(16.0) = 16, so min(17, 18-16) = min(17, 2) = 2 songs ✓
//     // - daysRemaining = 0.5: Math.floor(0.5) = 0, so min(17, 18-0) = min(17, 18) = 17 songs ✓
//     const unlockedCount = Math.min(numOfDays-1, numOfDays - Math.floor(daysRemaining))
    
//     // Cap at total number of songs
//     return songs.slice(0, Math.min(unlockedCount, songs.length))
//   }

//   // Calculate which song is "today's song" (the most recently unlocked)
//   const getCurrentSongIndex = () => {
//     const unlocked = getUnlockedSongs()
//     if (unlocked.length === 0) return -1
//     // Return the index of the last unlocked song (most recent)
//     return unlocked.length - 1
//   }

//   const currentTrackIndex = getCurrentSongIndex()
//   const currentSong = currentTrackIndex >= 0 && currentTrackIndex < songs.length ? songs[currentTrackIndex] : null
//   const unlockedSongs = getUnlockedSongs()
//   const remainingSurpriseSongs = Math.max(0, songs.length - unlockedSongs.length)

//   // Determine which song to play: selected song or today's song
//   const songToPlay = selectedSongIndex !== null 
//     ? (selectedSongIndex >= 0 && selectedSongIndex < songs.length ? songs[selectedSongIndex] : null)
//     : currentSong

//   // Check if URL is a YouTube/YouTube Music URL
//   const isYouTubeUrl = (url) => {
//     if (!url) return false
//     return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com')
//   }

//   // Extract video ID from YouTube URL
//   const extractYouTubeId = (url) => {
//     if (!url) return null
//     const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([^"&?\/\s]{11})/
//     const match = url.match(regExp)
//     return match ? match[1] : null
//   }

//   const youtubeVideoId = songToPlay?.url ? extractYouTubeId(songToPlay.url) : null
//   const isYouTube = songToPlay?.url ? isYouTubeUrl(songToPlay.url) : false

//   // Load the selected song or today's song
//   useEffect(() => {
//     const audio = audioRef.current
//     if (songToPlay?.url && !isYouTube) {
//       // Only load non-YouTube URLs in audio element
//       audio.src = songToPlay.url
//       audio.load()
//       // If a different song was selected, stop current playback
//       if (isPlaying && selectedSongIndex !== null && selectedSongIndex !== currentTrackIndex) {
//         setIsPlaying(false)
//       }
//     } else if (isYouTube) {
//       // For YouTube URLs, don't use audio element
//       audio.src = ''
//       audio.load()
//     } else {
//       audio.src = ''
//       audio.load()
//       setIsPlaying(false)
//     }
    
//     // Cleanup function
//     return () => {
//       // Don't pause here, let user control playback
//     }
//   }, [selectedSongIndex, songToPlay?.url, currentTrackIndex, isPlaying, isYouTube])

//   // Handle song ended - don't auto-play next, just stop
//   useEffect(() => {
//     const audio = audioRef.current
//     const handleEnded = () => {
//       setIsPlaying(false)
//     }
//     audio.addEventListener('ended', handleEnded)
//     return () => {
//       audio.removeEventListener('ended', handleEnded)
//     }
//   }, [])

//   const handlePlayPause = () => {
//     if (isYouTube) {
//       // For YouTube, toggle play state (iframe will handle playback)
//       setIsPlaying(!isPlaying)
//       if (!isPlaying && songToPlay?.lyrics) {
//         setShowLyrics(true)
//       }
//     } else {
//       const audio = audioRef.current
//       if (isPlaying) {
//         audio.pause()
//         setIsPlaying(false)
//       } else {
//         if (songToPlay?.url) {
//           audio.play().then(() => {
//             setIsPlaying(true)
//             // Auto-show lyrics when song starts playing
//             if (songToPlay?.lyrics) {
//               setShowLyrics(true)
//             }
//           }).catch((error) => {
//             console.log('Play error:', error)
//           })
//         }
//       }
//     }
//   }

//   const handlePlaySong = (songIndex) => {
//     setSelectedSongIndex(songIndex)
//     const selectedSong = songs[songIndex]
//     const isSelectedYouTube = selectedSong?.url ? isYouTubeUrl(selectedSong.url) : false
    
//     if (isSelectedYouTube) {
//       // For YouTube, just set playing state
//       setIsPlaying(true)
//       if (selectedSong?.lyrics) {
//         setShowLyrics(true)
//       }
//     } else {
//       // Auto-play the selected song
//       setTimeout(() => {
//         const audio = audioRef.current
//         if (audio.src) {
//           audio.play().then(() => {
//             setIsPlaying(true)
//             // Auto-show lyrics when song starts playing
//             if (selectedSong?.lyrics) {
//               setShowLyrics(true)
//             }
//           }).catch((error) => {
//             console.log('Play error:', error)
//           })
//         }
//       }, 100)
//     }
//   }

//   const handlePlayTodaySong = () => {
//     setSelectedSongIndex(null) // Reset to today's song
//     if (isYouTube) {
//       setIsPlaying(true)
//       if (currentSong?.lyrics) {
//         setShowLyrics(true)
//       }
//     } else {
//       setTimeout(() => {
//         const audio = audioRef.current
//         if (audio.src) {
//           audio.play().then(() => {
//             setIsPlaying(true)
//             // Auto-show lyrics when song starts playing
//             if (currentSong?.lyrics) {
//               setShowLyrics(true)
//             }
//           }).catch((error) => {
//             console.log('Play error:', error)
//           })
//         }
//       }, 100)
//     }
//   }

//   // Show message if songs haven't started yet
//   if (songs.length === 0) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5 }}
//         className="music-player"
//       >
//         <div className="music-player-container">
//           <div className="music-player-info">
//             {/* <div className="music-player-title">🎵 Music Player</div> */}
//             <div className="music-player-track">
//               <div className="track-name">No songs added yet</div>
//               <div className="track-artist">Add songs to the SONGS_LIST in the source code</div>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     )
//   }

//   // Show message if songs haven't started yet (too early)
//   if (daysRemaining === null || daysRemaining === undefined) {
//     return null
//   }

//   // Always show the playlist, even if no songs unlocked yet
//   if (daysRemaining >= numOfDays) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5 }}
//         className="music-player"
//       >
//         <div className="music-player-container">
//           <div className="music-player-info">
//             {/* <div className="music-player-title">🎵 Music Player</div> */}
//             <div className="music-player-track">
//               {/* <div className="track-name">Songs will start when less than 18 days remain</div> */}
//               {/* <div className="track-artist">First song unlocks when {Math.ceil(daysRemaining)} days remain</div> */}
//             </div>
//           </div>
//           {/* Show locked playlist */}
//           {songs.length > 0 && (
//             <div className="played-songs-box">
//               <div className="played-songs-title">
//                 📜 Playlist ({0} / {songs.length} unlocked)
//               </div>
//               <div className="played-songs-list">
//                 {songs.map((song, index) => (
//                   <div
//                     key={song.id}
//                     className="played-song-item locked"
//                     title="🔒 Locked - Coming soon"
//                   >
//                     <span className="played-song-number">🔒</span>
//                     <span className="played-song-name">🔒 Locked</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     )
//   }

//   // Show player with unlocked songs
//   if (unlockedSongs.length === 0) {
//     return null
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.5 }}
//       className="music-player"
//     >
//       <div className="music-player-container">
//         <div className="music-player-info">
//           <div className="music-player-title">
//             {selectedSongIndex !== null && selectedSongIndex !== currentTrackIndex 
//               ? '🎵 Playing from Playlist' 
//               : '🎵 Today\'s Song'}
//           </div>
//           <div className="music-player-day-info">
//             {selectedSongIndex !== null && selectedSongIndex !== currentTrackIndex 
//               ? `Day ${selectedSongIndex + 1} (Replay)`
//               : currentTrackIndex >= 0
//                 ? `Song ${currentTrackIndex + 1} of ${songs.length} - ${unlockedSongs.length} unlocked`
//                 : daysRemaining >= numOfDays
//                   ? `Are you ready for what is coming?`
//                   : 'All songs unlocked!'}
//           </div>
//           {songToPlay && (
//             <div className="music-player-track">
//               <div className="track-name">{songToPlay.title}</div>
//               <div className="track-artist">{songToPlay.artist}</div>
//             </div>
//           )}
//         </div>
//         <div className="music-player-controls">
//           <button onClick={handlePlayPause} className="control-btn play-pause-btn">
//             {isPlaying ? '⏸️' : '▶️'}
//           </button>
//           {selectedSongIndex !== null && selectedSongIndex !== currentTrackIndex && (
//             <button onClick={handlePlayTodaySong} className="control-btn today-btn" title="Play Today's Song">
//               📅
//             </button>
//           )}
//           {songToPlay?.lyrics && (
//             <button 
//               onClick={() => setShowLyrics(!showLyrics)} 
//               className="control-btn lyrics-btn" 
//               title={showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
//             >
//               📝
//             </button>
//           )}
//         </div>

//         {/* YouTube Player (for YouTube/YouTube Music URLs) */}
//         {isYouTube && youtubeVideoId && (
//           <div className="youtube-player-container">
//             <div className="youtube-player-wrapper">
//               <iframe
//                 width="100%"
//                 height="200"
//                 src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=${isPlaying ? 1 : 0}&controls=1&rel=0`}
//                 title={songToPlay?.title || 'YouTube Player'}
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 className="youtube-iframe"
//               ></iframe>
//             </div>
//             <div className="youtube-note">
//               💡 Note: YouTube Music URLs are embedded here. For direct audio playback, use a direct MP3/MP4 URL.
//             </div>
//           </div>
//         )}

//         {/* Lyrics Display */}
//         {showLyrics && songToPlay?.lyrics && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="lyrics-container"
//           >
//             <div className="lyrics-header">
//               <span className="lyrics-title">📝 Lyrics</span>
//               <button 
//                 onClick={() => setShowLyrics(false)} 
//                 className="lyrics-close-btn"
//                 title="Close Lyrics"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="lyrics-content">
//               {songToPlay.lyrics.split('\n').map((line, index) => (
//                 <p key={index} className="lyrics-line">
//                   {line || '\u00A0'}
//                 </p>
//               ))}
//             </div>
//           </motion.div>
//         )}
        
//         {/* Unlocked Songs Playlist - Compact Box */}
//         {songs.length > 0 && (
//           <div className="played-songs-box">
//             <div className="played-songs-title">
//               📜 Playlist ({unlockedSongs.length} / {songs.length} unlocked)
//             </div>
//             <div className="played-songs-list">
//               {songs.map((song, index) => {
//                 const isUnlocked = index < unlockedSongs.length
//                 const isSelected = selectedSongIndex === index
//                 const isToday = index === currentTrackIndex
                
//                 return (
//                   <div
//                     key={song.id}
//                     className={`played-song-item ${!isUnlocked ? 'locked' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
//                     onClick={() => isUnlocked && handlePlaySong(index)}
//                     title={isUnlocked ? `Song ${index + 1}: ${song.title}` : '🔒 Locked - Coming soon'}
//                   >
//                     <span className="played-song-number">
//                       {isUnlocked ? index + 1 : '🔒'}
//                     </span>
//                     <span className="played-song-name">
//                       {isUnlocked ? song.title : '🔒 Locked'}
//                     </span>
//                     {isToday && isUnlocked && <span className="played-song-badge">Today</span>}
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         )}

//         {/* Today's Song Info - Hidden future songs */}
//         <div className="music-player-schedule">
//           <div className="schedule-title">Today's Song</div>
//           {currentSong && (
//             <div className="schedule-item today flex flex-col">
//               <span className="schedule-day">Song {currentTrackIndex + 1}</span>
//               <span className="schedule-song">{currentSong.title}</span>
//               <span className="schedule-status">🎵 Playing Today</span>
//             </div>
//           )}
//           {remainingSurpriseSongs > 0 && (
//             <div className="schedule-note">
//               {remainingSurpriseSongs} surprise song{remainingSurpriseSongs !== 1 ? 's' : ''} coming soon! 🎁
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   )
// }

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  const [countdownEnded, setCountdownEnded] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [songDaysRemaining, setSongDaysRemaining] = useState(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const target = new Date(TARGET_DATE)
      const dayMs = 1000 * 60 * 60 * 24

      // Calculate date-only difference for song scheduling
      const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate())
      const daysDiff = Math.ceil((targetDate - nowDate) / dayMs)

      const difference = target.getTime() - now.getTime()

      if (difference > 0) {
        const displayDays = Math.max(0, Math.floor(difference / dayMs))
        const hours = Math.floor((difference % dayMs) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        // Use actual days remaining for song scheduling
        const daysRemaining = Math.max(0, daysDiff)
        setSongDaysRemaining(daysRemaining)
        setTimeLeft({
          days: displayDays,
          hours,
          minutes,
          seconds,
        })
        setCountdownEnded(false)
        setShowCelebration(false)
      } else {
        // Countdown has ended - show celebration
        const isPastDeadline = nowDate >= targetDate
        setSongDaysRemaining(isPastDeadline ? -1 : 0)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setCountdownEnded(true)
        // Show celebration immediately when countdown ends
        setShowCelebration(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === PASSWORD) {
      setError('')
      setIsAuthenticated(true)
      // Celebration will show automatically when countdown ends
    } else {
      setError('Incorrect password! Try again.')
      setPassword('')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="password-screen">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="password-container"
        >
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: 1
            }}
            transition={{ 
              delay: 0.2, 
              type: 'spring',
              scale: {
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }}
            className="password-title"
          >
            Something Special Awaits... ⏳
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0.7, 1, 0.7],
              y: 0
            }}
            transition={{ 
              delay: 0.4,
              opacity: {
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }}
            className="password-subtitle"
          >
            Unlock the secret to reveal what's coming...
          </motion.p>
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleSubmit}
            className="password-form"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="🔐 Enter the secret code..."
              className="password-input"
              autoFocus
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message"
              >
                {error}
              </motion.p>
            )}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(102, 126, 234, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 10px rgba(102, 126, 234, 0.3)",
                  "0 0 20px rgba(102, 126, 234, 0.5)",
                  "0 0 10px rgba(102, 126, 234, 0.3)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              type="submit"
              className="password-button"
            >
              🔓 Unlock
            </motion.button>
          </motion.form>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              delay: 0.8,
              opacity: {
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }}
            className="password-hint"
          >
            {/* 💡 Hint: Think of a special day... "birthday2024" */}
          </motion.p>
        </motion.div>
      </div>
    )
  }

  // Show countdown only screen if timer hasn't ended
  if (!countdownEnded) {
    return (
      <div className="countdown-screen">
        <div className="countdown-only-content">
          <div className="countdown-grid-dark">
            <motion.div
              className="countdown-item-dark"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            >
              <div className="countdown-value-dark">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="countdown-label-dark">Days</div>
            </motion.div>
            <motion.div
              className="countdown-item-dark"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.25 }}
            >
              <div className="countdown-value-dark">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="countdown-label-dark">Hours</div>
            </motion.div>
            <motion.div
              className="countdown-item-dark"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            >
              <div className="countdown-value-dark">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="countdown-label-dark">Minutes</div>
            </motion.div>
            <motion.div
              className="countdown-item-dark"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.75 }}
            >
              <div className="countdown-value-dark">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="countdown-label-dark">Seconds</div>
            </motion.div>
          </div>
          {/* Messages Component */}
          <Messages daysRemaining={songDaysRemaining} numOfDays={numOfDays} />
          {/* Music Player */}
          <MusicPlayer daysRemaining={songDaysRemaining} numOfDays={numOfDays} />
        </div>
      </div>
    )
  }

  // Show full birthday celebration when countdown ends
  return (
    <div className='p-20'>
    <div className="celebration-gui h-screen overflow-x-hidden overflow-y-auto fixed inset-0">
        <div className="birthday-app ">
      <div className="containerForGallery relative">
      {/* Gallery positioned absolutely over everything */}
      <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 50 }}>
        <Gallery />
      </div>

      <AnimatePresence>
        {showCelebration && (
          <>
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="confetti"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: 360,
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            ))}

            {/* Balloons */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`balloon-${i}`}
                className="balloon"
                initial={{
                  x: (window.innerWidth / 13) * (i + 1),
                  y: window.innerHeight + 100,
                }}
                animate={{
                  y: -200,
                  x: (window.innerWidth / 13) * (i + 1) + (Math.random() - 0.5) * 100,
                }}
                transition={{
                  duration: Math.random() * 3 + 4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeOut',
                }}
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94', '#c7ceea'][
                    Math.floor(Math.random() * 6)
                  ],
                }}
              />
            ))}

            {/* Sparkles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="sparkle"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      </div>


      <div className="celebration-content flex flex-col items-center justify-center gap-8 relative px-8 py-12 md:p-10 lg:p-14">
        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="main-title"
        >
          🎂 Happy Birthday! 🎂
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="name-title"
        >
          {BIRTHDAY_PERSON}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="cake-container"
        >
          <div className="cake">
            <div className="candle">
              <motion.div
                className="flame"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="birthday-message"
        >
          Wishing you a day filled with happiness and a year filled with joy! 🎉
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="emoji-row"
        >
          {['🎈', '🎁', '🎊', '🎉', '🎂', '🍰', '🎈', '🎁'].map((emoji, i) => (
            <motion.span
              key={i}
              className="emoji"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="wishes"
        >
          <motion.p
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            May all your dreams come true! ✨
          </motion.p>
        </motion.div>

        {/* Music Player with all songs unlocked */}
        <Messages daysRemaining={songDaysRemaining} numOfDays={numOfDays} />

        <MusicPlayer daysRemaining={-1} numOfDays={numOfDays} className="w-1/2"/>
      </div>
      
    </div>
    </div>
    </div>
  )
}

export default App
