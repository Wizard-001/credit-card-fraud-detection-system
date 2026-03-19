import { motion } from 'framer-motion'

interface ResultData {
  is_fraud:            boolean
  fraud_probability:   number
  safe_probability:    number
  threshold:           number
}

export const FraudResult = ({ result, onReset }: { result: ResultData, onReset: () => void }) => {
  const isFraud = result.is_fraud

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`w-full max-w-2xl p-8 rounded-3xl border text-center relative overflow-hidden backdrop-blur-xl ${
        isFraud
          ? 'bg-red-500/10   border-red-500/40'
          : 'bg-green-500/10 border-green-500/40'
      }`}
    >
      {/* Background Glow */}
      <div className={`absolute -inset-20 opacity-20 blur-[80px] ${isFraud ? 'bg-red-500' : 'bg-green-500'}`} />

      {/* Emoji */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0   }}
        transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
        className="text-6xl mb-4 relative z-10"
      >
        {isFraud ? '🚨' : '✅'}
      </motion.div>

      {/* Verdict */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.2 }}
        className={`text-3xl font-bold tracking-widest mb-2 relative z-10 ${
          isFraud ? 'text-red-400' : 'text-green-400'
        }`}
      >
        {isFraud ? 'FRAUD DETECTED' : 'TRANSACTION SAFE'}
      </motion.h3>

      <p className="text-gray-400 text-sm mb-6 relative z-10">
        {isFraud
          ? 'This transaction has been flagged as likely fraudulent'
          : 'No fraudulent activity detected in this transaction'}
      </p>

      {/* Probability Bar */}
      <div className="w-full bg-white/5 rounded-full h-2.5 mb-6 overflow-hidden relative z-10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${isFraud ? result.fraud_probability : result.safe_probability}%` }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isFraud
              ? 'bg-gradient-to-r from-red-600 to-red-400'
              : 'bg-gradient-to-r from-green-600 to-green-400'
          }`}
        />
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-3 gap-4 relative z-10 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg backdrop-blur-md"
        >
          <div className="text-2xl font-bold text-red-400">
            {result.fraud_probability}%
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            Fraud Prob.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg backdrop-blur-md"
        >
          <div className="text-2xl font-bold text-gray-400">
            {result.threshold}%
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            Threshold
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg backdrop-blur-md"
        >
          <div className="text-2xl font-bold text-green-400">
            {result.safe_probability}%
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            Safe Prob.
          </div>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-semibold transition-all relative z-10"
      >
        Run New Analysis
      </motion.button>
    </motion.div>
  )
}
