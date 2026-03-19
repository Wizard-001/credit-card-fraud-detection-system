import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select...', 
  label, 
  icon,
  className 
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-2 relative w-full", className)} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-gray-400/80 flex items-center gap-2">
          {icon} {label}
        </label>
      )}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full glass-card rounded-xl px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-white/10 transition-all group relative z-20"
      >
        <span className={cn("text-sm", !selectedOption ? "text-gray-500" : "text-white")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 8 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 z-[100] bg-black border border-white/20 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,1)] overflow-hidden"
            style={{ 
              backgroundColor: '#000000',
              zIndex: 9999
            }}
          >
            <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-all cursor-pointer mb-1 last:mb-0",
                    value === option.value 
                      ? "bg-indigo-600 text-white font-bold" 
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  )}
                  style={value === option.value ? { backgroundColor: '#4f46e5' } : {}}
                >
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {option.label}
                  </span>
                  {value === option.value && (
                    <Check className="w-4 h-4 ml-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
