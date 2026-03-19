import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Tag, 
  Clock, 
  User, 
  MapPin, 
  Send
} from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface FraudFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const FraudForm = ({ onSubmit, isLoading }: FraudFormProps) => {
  const [formData, setFormData] = useState({
    amt: '',
    category: 'grocery_pos',
    hour: '12',
    age: '25',
    gender: 'M',
    cust_state: 'CA',
    merch_state: 'CA'
  });

  const US_STATES = [
    { label: 'Alabama', value: 'AL' }, { label: 'Alaska', value: 'AK' }, { label: 'Arizona', value: 'AZ' }, { label: 'Arkansas', value: 'AR' },
    { label: 'California', value: 'CA' }, { label: 'Colorado', value: 'CO' }, { label: 'Connecticut', value: 'CT' }, { label: 'Delaware', value: 'DE' },
    { label: 'Florida', value: 'FL' }, { label: 'Georgia', value: 'GA' }, { label: 'Hawaii', value: 'HI' }, { label: 'Idaho', value: 'ID' },
    { label: 'Illinois', value: 'IL' }, { label: 'Indiana', value: 'IN' }, { label: 'Iowa', value: 'IA' }, { label: 'Kansas', value: 'KS' },
    { label: 'Kentucky', value: 'KY' }, { label: 'Louisiana', value: 'LA' }, { label: 'Maine', value: 'ME' }, { label: 'Maryland', value: 'MD' },
    { label: 'Massachusetts', value: 'MA' }, { label: 'Michigan', value: 'MI' }, { label: 'Minnesota', value: 'MN' }, { label: 'Mississippi', value: 'MS' },
    { label: 'Missouri', value: 'MO' }, { label: 'Montana', value: 'MT' }, { label: 'Nebraska', value: 'NE' }, { label: 'Nevada', value: 'NV' },
    { label: 'New Hampshire', value: 'NH' }, { label: 'New Jersey', value: 'NJ' }, { label: 'New Mexico', value: 'NM' }, { label: 'New York', value: 'NY' },
    { label: 'North Carolina', value: 'NC' }, { label: 'North Dakota', value: 'ND' }, { label: 'Ohio', value: 'OH' }, { label: 'Oklahoma', value: 'OK' },
    { label: 'Oregon', value: 'OR' }, { label: 'Pennsylvania', value: 'PA' }, { label: 'Rhode Island', value: 'RI' }, { label: 'South Carolina', value: 'SC' },
    { label: 'South Dakota', value: 'SD' }, { label: 'Tennessee', value: 'TN' }, { label: 'Texas', value: 'TX' }, { label: 'Utah', value: 'UT' },
    { label: 'Vermont', value: 'VT' }, { label: 'Virginia', value: 'VA' }, { label: 'Washington', value: 'WA' }, { label: 'West Virginia', value: 'WV' },
    { label: 'Wisconsin', value: 'WI' }, { label: 'Wyoming', value: 'WY' },
  ];

  const CATEGORIES = [
    { value: 'food_dining',    label: '🍕 Food & Dining' },
    { value: 'gas_transport',  label: '⛽ Gas & Transport' },
    { value: 'grocery_net',    label: '🛒 Grocery — Online' },
    { value: 'grocery_pos',    label: '🛒 Grocery — In Store' },
    { value: 'health_fitness', label: '💊 Health & Fitness' },
    { value: 'home',           label: '🏠 Home' },
    { value: 'kids_pets',      label: '🧸 Kids & Pets' },
    { value: 'misc_net',       label: '🛍️ Miscellaneous — Online' },
    { value: 'misc_pos',       label: '🛍️ Miscellaneous — In Store' },
    { value: 'personal_care',  label: '💄 Personal Care' },
    { value: 'shopping_net',   label: '🌐 Shopping — Online' },
    { value: 'shopping_pos',   label: '🏪 Shopping — In Store' },
    { value: 'travel',         label: '✈️ Travel' },
    { value: 'entertainment',  label: '🎬 Entertainment' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getHourLabels = (hourStr: string) => {
    const h = parseInt(hourStr);
    if (isNaN(h)) return null;
    
    // AM/PM
    const period = h < 12 ? 'AM' : 'PM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const ampm = `${displayHour} ${period}`;

    // Time of day
    let timeOfDay = '';
    if (h >= 5 && h < 12) timeOfDay = '🌅 Morning';
    else if (h >= 12 && h < 17) timeOfDay = '☀️ Afternoon';
    else if (h >= 17 && h < 21) timeOfDay = '🌆 Evening';
    else timeOfDay = '🌙 Night';

    return { ampm, timeOfDay };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="w-full max-w-4xl glass-card rounded-[2.5rem] p-8 md:p-12 space-y-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32" />
      
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary glow-shadow">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transaction Analysis</h2>
          <p className="text-gray-400 text-sm">Enter transaction details for fraud detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Amount ($)
            </label>
            <input
              required
              type="number"
              step="0.01"
              name="amt"
              value={formData.amt}
              onChange={handleChange}
              placeholder="330.00"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <CustomSelect 
            label="Category"
            icon={<Tag className="w-4 h-4" />}
            options={CATEGORIES}
            value={formData.category}
            onChange={(val) => handleSelectChange('category', val)}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Transaction Hour (0-23)
            </label>
            <input
              required
              type="number"
              min="0"
              max="23"
              name="hour"
              value={formData.hour}
              onChange={handleChange}
              placeholder="1"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors"
            />
            {formData.hour && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mt-2 px-1"
              >
                <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/30">
                  {getHourLabels(formData.hour)?.ampm}
                </span>
                <span className="text-xs font-medium text-gray-400 italic">
                  — {getHourLabels(formData.hour)?.timeOfDay}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <User className="w-4 h-4" /> Customer Age
            </label>
            <input
              required
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="21"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Gender</label>
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
              {['M', 'F'].map((gen) => (
                <button
                  key={gen}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, gender: gen }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.gender === gen 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {gen === 'M' ? 'Male' : 'Female'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect 
              label="Customer's Home State"
              icon={<MapPin className="w-4 h-4" />}
              options={US_STATES}
              value={formData.cust_state}
              onChange={(val) => handleSelectChange('cust_state', val)}
              placeholder="Select state..."
            />

            <CustomSelect 
              label="Merchant's State"
              icon={<MapPin className="w-4 h-4" />}
              options={US_STATES}
              value={formData.merch_state}
              onChange={(val) => handleSelectChange('merch_state', val)}
              placeholder="Select state..."
              className="md:col-span-2 md:mt-2"
            />
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: "rgb(129, 140, 248)" }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-primary to-secondary py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Analyze Transaction <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </motion.button>
    </motion.form>
  );
};
