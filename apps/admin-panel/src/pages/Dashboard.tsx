import React from 'react';
import { ShoppingBag, Eye, MessageCircle } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">İşletme Özeti</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Toplam Ürün</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Aylık Görüntülenme</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Aylık WhatsApp Tıklaması</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
