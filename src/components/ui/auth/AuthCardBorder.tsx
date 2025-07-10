import { motion } from 'framer-motion';

export function AuthCardBorder() {
  return (
    <>
      {/* Card glow effect */}
      <motion.div 
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
        animate={{
          boxShadow: [
            "0 0 20px 3px rgba(239, 68, 68, 0.1)",
            "0 0 30px 6px rgba(239, 68, 68, 0.2)",
            "0 0 20px 3px rgba(239, 68, 68, 0.1)"
          ]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut", 
          repeatType: "mirror" 
        }}
      />

      {/* Traveling light beam effects */}
      <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-70"
          initial={{ filter: "blur(2px)" }}
          animate={{ 
            left: ["-50%", "100%"],
            opacity: [0.3, 0.8, 0.3],
            filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
          }}
          transition={{ 
            left: {
              duration: 2.5, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatDelay: 1
            },
            opacity: {
              duration: 1.2,
              repeat: Infinity,
              repeatType: "mirror"
            },
            filter: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror"
            }
          }}
        />
        
        <motion.div 
          className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-red-400 to-transparent opacity-70"
          initial={{ filter: "blur(2px)" }}
          animate={{ 
            top: ["-50%", "100%"],
            opacity: [0.3, 0.8, 0.3],
            filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
          }}
          transition={{ 
            top: {
              duration: 2.5, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatDelay: 1,
              delay: 0.6
            },
            opacity: {
              duration: 1.2,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 0.6
            },
            filter: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 0.6
            }
          }}
        />
        
        <motion.div 
          className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-70"
          initial={{ filter: "blur(2px)" }}
          animate={{ 
            right: ["-50%", "100%"],
            opacity: [0.3, 0.8, 0.3],
            filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
          }}
          transition={{ 
            right: {
              duration: 2.5, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatDelay: 1,
              delay: 1.2
            },
            opacity: {
              duration: 1.2,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 1.2
            },
            filter: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 1.2
            }
          }}
        />
        
        <motion.div 
          className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-red-400 to-transparent opacity-70"
          initial={{ filter: "blur(2px)" }}
          animate={{ 
            bottom: ["-50%", "100%"],
            opacity: [0.3, 0.8, 0.3],
            filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
          }}
          transition={{ 
            bottom: {
              duration: 2.5, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatDelay: 1,
              delay: 1.8
            },
            opacity: {
              duration: 1.2,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 1.8
            },
            filter: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 1.8
            }
          }}
        />
        
        {/* Corner glow spots */}
        <motion.div 
          className="absolute top-0 left-0 h-[5px] w-[5px] rounded-full bg-red-400/60 blur-[1px]"
          animate={{ 
            opacity: [0.4, 0.8, 0.4] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        <motion.div 
          className="absolute top-0 right-0 h-[8px] w-[8px] rounded-full bg-red-400/80 blur-[2px]"
          animate={{ 
            opacity: [0.4, 0.8, 0.4] 
          }}
          transition={{ 
            duration: 2.4, 
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0.5
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 h-[8px] w-[8px] rounded-full bg-red-400/80 blur-[2px]"
          animate={{ 
            opacity: [0.4, 0.8, 0.4] 
          }}
          transition={{ 
            duration: 2.2, 
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 h-[5px] w-[5px] rounded-full bg-red-400/60 blur-[1px]"
          animate={{ 
            opacity: [0.4, 0.8, 0.4] 
          }}
          transition={{ 
            duration: 2.3, 
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1.5
          }}
        />
      </div>

      {/* Enhanced card border with subtle hover effect */}
      <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-red-500/10 via-red-400/20 to-red-500/10 opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
    </>
  );
}