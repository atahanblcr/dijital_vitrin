import React from 'react';
import { Settings, Bell, Shield, Database, Save, Globe } from 'lucide-react';

const PlatformSettings = () => {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Genel Ayarlar</h2>
        <p className="text-gray-500 text-sm">Dijital Vitrin platform parametrelerini buradan yönetin.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Görsel Ayarları */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Settings className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800">Ürün & Görsel Ayarları</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Varsayılan Max. Görsel Sayısı</label>
              <input type="number" defaultValue={7} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Maksimum Dosya Boyutu (MB)</label>
              <input type="number" defaultValue={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Duyuru Ayarları */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Bell className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-gray-800">Global Duyuru</h3>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tüm İşletme Panellerinde Gösterilecek Mesaj</label>
            <textarea 
              placeholder="Örn: 15 Mart tarihinde sistem bakımı yapılacaktır."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
            ></textarea>
          </div>
        </div>

        {/* Güvenlik Ayarları */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-800">Sistem Güvenliği</h3>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Bakım Modu</p>
              <p className="text-xs text-gray-500">Aktif edildiğinde vitrin siteleri ve paneller erişime kapanır.</p>
            </div>
            <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
          <Save className="w-5 h-5 mr-2" /> Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
};

export default PlatformSettings;
