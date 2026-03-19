import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Background } from './components/Background';
import { FraudForm } from './components/FraudForm';
import { FraudResult } from './components/FraudResult';
import Scroll3D from './components/Scroll3D';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amt: parseFloat(data.amt),
          category: data.category,
          hour: parseInt(data.hour),
          age: parseInt(data.age),
          gender: data.gender,
          cust_state: data.cust_state.toUpperCase(),
          merch_state: data.merch_state.toUpperCase()
        }),
      });

      if (!response.ok) {
        throw new Error(`ML Backend Error (${response.status}). Check for CORS issues or ensure the endpoint is /predict`);
      }

      const prediction = await response.json();
      setResult(prediction);
    } catch (err: any) {
      console.error('Prediction error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-[#0f172a]">
      <Background />
      <Scroll3D />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh] lg:translate-x-[5%]">
          {/* Left Column: Content and Form */}
          <div className="space-y-12 lg:pl-12">
            <header className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl md:text-7xl font-black tracking-tight"
              >
                FRAUD <span className="text-gradient">SHIELD</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 max-w-lg"
              >
                Real-time credit card transaction analysis powered by advanced machine learning models. 
                Experience institutional-grade security in every swipe.
              </motion.p>
            </header>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-2xl backdrop-blur-md mb-4 max-w-md"
                >
                  {error}
                </motion.div>
              )}

              {!result ? (
                <FraudForm key="form" onSubmit={handlePredict} isLoading={loading} />
              ) : (
                <FraudResult key="result" result={result} onReset={() => setResult(null)} />
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Reserved for 3D visual space (managed by Scroll3D) */}
          <div className="hidden lg:block h-full pointer-events-none" />
        </div>

        <footer className="mt-12 text-white/10 text-xs font-mono tracking-widest uppercase">
          &copy; 2026 FRAUD SHIELD . ALL RIGHTS RESERVED
        </footer>
      </main>
    </div>
  );
}

export default App;
