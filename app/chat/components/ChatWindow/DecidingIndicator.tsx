import { motion } from "framer-motion";

const DecidingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 px-12 py-2 pb-6">
      <span className="text-gray-500 text-sm">Thinking</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 bg-gray-500 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DecidingIndicator;
