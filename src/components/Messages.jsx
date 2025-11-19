import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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
function Messages({ daysRemaining, numOfDays }) {
  const messages = MESSAGES_LIST
  const [selectedMessageId, setSelectedMessageId] = useState(null)
  const [revealedMessages, setRevealedMessages] = useState(new Set())

  // Calculate unlocked messages based on days remaining
  // Same unlock logic as songs:
  //   - First message: daysRemaining < numOfDays (1 message) - when less than numOfDays days remain
  //   - Second message: daysRemaining < 17 (2 messages total) - when less than 17 days remain
  //   - ... continue pattern
  //   - numOfDaysth message (last): daysRemaining <= 0 (numOfDays messages, at celebration)
  const getUnlockedMessages = () => {
    if (messages.length === 0) return []
    if (daysRemaining === null || daysRemaining === undefined) return []
    
    // If past deadline or at celebration, all messages unlocked
    if (daysRemaining <= 0) return messages
    
    // If numOfDays or more days remaining, no messages unlocked
    if (daysRemaining >= numOfDays) return []
    
    // Calculate how many messages are unlocked
    // Formula: unlockedCount = Math.min(numOfDays-1, numOfDays - Math.floor(daysRemaining))
    const unlockedCount = Math.min(numOfDays-1, numOfDays - Math.floor(daysRemaining))
    
    // Cap at total number of messages
    return messages.slice(0, Math.min(unlockedCount, messages.length))
  }

  const unlockedMessages = getUnlockedMessages()
  const remainingMessages = Math.max(0, messages.length - unlockedMessages.length)

  // Get today's message (the latest unlocked message)
  const getTodayMessage = () => {
    if (unlockedMessages.length === 0) return null
    return unlockedMessages[unlockedMessages.length - 1]
  }

  const todayMessage = getTodayMessage()
  
  // Get the currently displayed message (selected or today's)
  const displayedMessage = selectedMessageId 
    ? unlockedMessages.find(msg => msg.id === selectedMessageId) || todayMessage
    : todayMessage

  // Check if current message is revealed
  const isMessageRevealed = displayedMessage ? revealedMessages.has(displayedMessage.id) : false

  // Handle cover click to reveal message
  const handleRevealMessage = () => {
    if (displayedMessage) {
      setRevealedMessages(prev => new Set([...prev, displayedMessage.id]))
    }
  }

  // Reset reveal when message changes (optional - remove if you want covers to stay revealed)
  useEffect(() => {
    // Auto-reveal today's message after a short delay
    if (todayMessage && !selectedMessageId && !revealedMessages.has(todayMessage.id)) {
      // You can remove this auto-reveal if you want manual reveal only
    }
  }, [todayMessage, selectedMessageId, revealedMessages])

  // Always show the messages section, even if no messages unlocked yet
  if (daysRemaining >= numOfDays) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[600px] mx-auto my-8 px-4 md:my-6 md:px-2"
      >
        <div className="text-2xl md:text-xl text-white/90 font-bold mb-6 md:mb-4 tracking-wide text-center">Daily Messages</div>
        <div className="bg-linear-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-[15px] p-8 border-2 border-white/10 text-center">
          <p className="text-white/60 text-base italic">Messages will start appearing as the countdown progresses!</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[600px] mx-auto my-8 px-4 md:my-6 md:px-2 flex flex-col gap-5"
    >
      <div className="text-2xl md:text-xl text-white/90 font-bold mb-6 md:mb-4 tracking-wide text-center">
        Daily Messages 🎁 
        {remainingMessages > 0 && (
          <span className="text-sm text-white/60 font-normal ml-2">  ({remainingMessages} more to come)</span>
        )}
      </div>
      
      {/* Today's Message Display */}
      {displayedMessage && (
        <motion.div
          key={displayedMessage.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-linear-to-br from-[#2a2a1a] to-[#3a3a2a] rounded-[15px] p-8 md:p-6 border-2 border-yellow-500/50 shadow-[0_6px_24px_rgba(255,215,0,0.2)] mb-6 relative overflow-hidden min-h-[200px] flex items-center justify-center"
        >
          {/* Message Cover */}
          {!isMessageRevealed && (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, rotate: -5 }}
              transition={{ duration: 0.5 }}
              onClick={handleRevealMessage}
              className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-indigo-900/90 backdrop-blur-sm cursor-pointer z-10 flex flex-col items-center justify-center p-8 group"
            >
              {/* Decorative Elements */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/20"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.2, 0.8, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Sparkle Effect */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                    style={{
                      left: `${20 + (i * 10)}%`,
                      top: `${20 + (i % 4) * 20}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      rotate: 360,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>

              {/* Main Content */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative z-10 text-center"
              >
                <div className="text-6xl md:text-5xl mb-4">🎁</div>
                <div className="text-2xl md:text-xl font-bold text-white/90 mb-3 tracking-wide">
                  A Special Message Awaits
                </div>
                <div className="text-base md:text-sm text-white/70 mb-6 font-medium">
                  Click to reveal your message
                </div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-3xl"
                >
                  👆
                </motion.div>
              </motion.div>

              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </motion.div>
          )}

          {/* Message Content */}
          {isMessageRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full"
            >
              <div className="text-sm text-yellow-400/80 font-semibold mb-3 uppercase tracking-wider">
                {selectedMessageId === todayMessage?.id || !selectedMessageId ? "Today's Message" : `Day ${displayedMessage.id} Message`}
              </div>
              <div className="text-lg md:text-base text-white/95 leading-relaxed font-normal">
                {displayedMessage.message}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Messages List */}
      <div className="flex flex-col gap-5">
        <div className="text-sm text-white/70 font-semibold mb-2 uppercase tracking-wide">All Messages</div>
        {unlockedMessages.map((message, index) => {
          const isSelected = selectedMessageId === message.id || (!selectedMessageId && index === unlockedMessages.length - 1)
          return (
            <motion.button
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setSelectedMessageId(message.id)
                // Cover will automatically show if message hasn't been revealed
              }}
              className={` w-full text-left bg-linear-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-[12px] p-4 md:p-3 border-2 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
                isSelected 
                  ? 'border-yellow-500/70 bg-linear-to-br from-[#2a2a1a] to-[#3a3a2a] shadow-md' 
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold text-white/80 ">Day {message.id}</div>
                {isSelected && (
                  <div className="text-yellow-400 text-xs">●</div>
                )}
              </div>
            </motion.button>
          )
        })}
        
        {remainingMessages > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-linear-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-[12px] p-4 md:p-3 border-2 border-dashed border-white/10 shadow-lg opacity-60"
          >
            <div className="text-sm text-white/50 italic text-center leading-relaxed font-normal">
              🔒 {remainingMessages} more message{remainingMessages > 1 ? 's' : ''} will unlock as the countdown continues...
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Messages

