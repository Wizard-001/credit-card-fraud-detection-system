import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AlertTriangle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

interface ResultDisplayProps {
  result: {
    isFraud: boolean;
    confidence: number;
    details: string[];
  } | null;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  if (!result) return null;

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-8 w-full max-w-lg"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "glass-card w-full p-10 rounded-[2.5rem] relative overflow-hidden group transition-all duration-500",
          result.isFraud ? "border-red-500/30" : "border-emerald-500/30"
        )}
      >
        {/* Background Glow */}
        <div className={cn(
          "absolute -inset-20 opacity-20 blur-[80px] transition-colors duration-500",
          result.isFraud ? "bg-red-500" : "bg-emerald-500"
        )} />

        <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}>
          <div className="flex flex-col items-center text-center gap-6 relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={cn(
                "p-5 rounded-full shadow-2xl",
                result.isFraud ? "bg-red-500/20 text-red-500" : "bg-emerald-500/20 text-emerald-500"
              )}
            >
              {result.isFraud ? <AlertTriangle size={48} /> : <ShieldCheck size={48} />}
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium uppercase tracking-[0.2em] opacity-50">
                Security Analysis Result
              </h3>
              <h2 className={cn(
                "text-5xl font-black italic tracking-tight",
                result.isFraud ? "text-red-400" : "text-emerald-400"
              )}>
                {result.isFraud ? "FRAUD DETECTED" : "TRANSACTION SAFE"}
              </h2>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-6xl font-light text-white">
                {result.confidence}%
              </span>
              <span className="text-sm text-gray-400">Security Score</span>
            </div>

            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={cn(
                  "h-full rounded-full",
                  result.isFraud ? "bg-red-500" : "bg-emerald-500"
                )}
              />
            </div>

            <ul className="text-left w-full space-y-3 mt-4">
              {result.details.map((detail, i) => (
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-300"
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full", result.isFraud ? "bg-red-400" : "bg-emerald-400")} />
                  {detail}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.button
        whileHover={{ x: -5 }}
        onClick={onReset}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={18} /> Run New Analysis
      </motion.button>
    </motion.div>
  );
};
