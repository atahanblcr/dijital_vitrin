import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  expectedValue: string;
  confirmButtonText?: string;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  expectedValue,
  confirmButtonText = 'Kalıcı Olarak Sil',
  isLoading = false
}: ConfirmationModalProps) {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                <AlertTriangle size={24} />
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              {description}
            </p>

            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
              <p className="text-sm text-red-700 font-medium mb-2">
                Devam etmek için lütfen <span className="font-bold underline">{expectedValue}</span> yazın:
              </p>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={expectedValue}
                className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all font-bold text-red-900 placeholder:text-red-200"
                autoFocus
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                Vazgeç
              </button>
              <button
                onClick={onConfirm}
                disabled={inputValue !== expectedValue || isLoading}
                className="flex-1 px-6 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                {isLoading ? 'Siliniyor...' : confirmButtonText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
