'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWhatsAppUrl } from '../../../../../packages/shared/utils/whatsapp';

interface WhatsAppButtonProps {
  phoneNumber: string;
  businessName: string;
  productName?: string;
}

export default function WhatsAppButton({ phoneNumber, businessName, productName }: WhatsAppButtonProps) {
  if (!phoneNumber) return null;

  let message = `Merhaba! ${businessName} ile iletişime geçmek istiyorum.`;
  if (productName) {
    message = `Merhaba! ${businessName} — ${productName} hakkında bilgi almak istiyorum.`;
  }

  const url = getWhatsAppUrl(phoneNumber, message);

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a] transition-colors"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="WhatsApp'tan Bize Ulaşın"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping" style={{ animationDuration: '2s' }}></span>
      <MessageCircle size={28} className="relative z-10" />
    </motion.a>
  );
}
