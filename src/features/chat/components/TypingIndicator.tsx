
const TypingIndicator = () => {
  return (
    <div className="flex space-x-2 px-4 py-2 glass-card rounded-tr-xl rounded-br-xl rounded-bl-xl max-w-[80%] md:max-w-[70%]">
      <div className="w-2 h-2 bg-thinkforge-purple/70 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-thinkforge-purple/70 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-thinkforge-purple/70 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default TypingIndicator;
