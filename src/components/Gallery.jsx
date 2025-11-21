import { motion } from 'framer-motion'
import { useState } from 'react'

function Gallery() {
  const [photos] = useState([
    { id: 1, src: '/photos/Black And White Logo.png', label: 'Memory 1', rotation: -5 },
    { id: 2, src: '/photos/Black And White Logo.png', label: 'Memory 2', rotation: 3 },
    { id: 3, src: '/photos/Black And White Logo.png', label: 'Memory 3', rotation: -4 },
    { id: 4, src: '/photos/Black And White Logo.png', label: 'Memory 4', rotation: 4 },
    { id: 5, src: '/photos/Black And White Logo.png', label: 'Memory 5', rotation: -3 },
    { id: 6, src: '/photos/Black And White Logo.png', label: 'Memory 6', rotation: 5 }
  ])

  return (
    <div className="absolute inset-0 w-full h-screen flex items-center justify-center pointer-events-none p-2 md:p-8">
      {/* Grid layout: 2 rows x 3 columns */}
      <div className="grid grid-cols-3 grid-rows-2 gap-2 md:gap-6 lg:gap-12 w-full h-full max-w-5xl mx-auto pointer-events-auto">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: photo.rotation
            }}
            transition={{
              delay: index * 0.15,
              duration: 0.5,
              type: 'spring',
              stiffness: 200
            }}
            whileHover={{
              scale: 1.1,
              rotate: 0,
              zIndex: 100,
              transition: { duration: 0.3 }
            }}
          >
            {/* Photo Frame - maintain aspect ratio across all screens */}
            <div className="relative bg-white p-2 md:p-4 shadow-2xl rounded-sm w-full flex flex-col" style={{ aspectRatio: '4/5' }}>
              {/* Pin on top */}
              <div className="absolute -top-1.5 md:-top-3 left-1/2 -translate-x-1/2 w-3 h-3 md:w-6 md:h-6 bg-red-500 rounded-full shadow-md border-2 border-red-700"></div>

              {/* Photo Content */}
              <div className="flex-1 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-sm min-h-0">
                {/* <span className="text-3xl md:text-6xl lg:text-7xl">{photo.placeholder}</span> */}
                <img 
                  src={photo.src} 
                  alt={photo.label} 
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>

              {/* Photo Label */}
              <div className="mt-1 md:mt-3 text-center text-gray-700 text-[0.6rem] md:text-sm lg:text-base font-medium">
                {photo.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Gallery
