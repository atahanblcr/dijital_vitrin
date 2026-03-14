import React, { useState, useEffect } from 'react';
import { Save, Bell, Shield, Image as ImageIcon, Info, RefreshCcw } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

const PlatformSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    default_max_images: 7,
    max_file_size_mb: 5,
    global_announcement: '',
    maintenance_mode: false
  });

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data.data) {
        setSettings({
          default_max_images: res.data.data.default_max_images,
          max_file_size_mb: res.data.data.max_file_size_mb,
          global_announcement: res.data.data.global_announcement || '',
          maintenance_mode: res.data.data.maintenance_mode
        });
      }
    } catch (error) {
      toast.error('Ayarlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success('Sistem ayarları başarıyla güncellendi');
    } catch (error) {
      toast.error('Ayarlar kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-gray-500">Ayarlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Platform Ayarları</h2>
        <p className="text-gray-500 text-sm">Tüm sistemi etkileyen genel yapılandırmalar.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Görsel ve Dosya Ayarları */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800">Medya Ayarları</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Varsayılan Max. Görsel Sayısı</label>
              <input 
                type="number" 
                value={settings.default_max_images}
                onChange={e => setSettings({ ...settings, default_max_images: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
              <p className="text-[10px] text-gray-400">Yeni işletmeler için başlangıç limiti.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Maksimum Dosya Boyutu (MB)</label>
              <input 
                type="number" 
                value={settings.max_file_size_mb}
                onChange={e => setSettings({ ...settings, max_file_size_mb: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
              <p className="text-[10px] text-gray-400">Yüklenecek her bir görsel için üst sınır.</p>
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
              value={settings.global_announcement}
              onChange={e => setSettings({ ...settings, global_announcement: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
            ></textarea>
            <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
              <Info className="w-4 h-4" />
              Bu mesaj tüm işletme sahiplerinin dashboard ekranında görünecektir.
            </div>
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
            <button 
              onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${settings.maintenance_mode ? 'bg-red-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-200 ${settings.maintenance_mode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70"
        >
          {saving ? (
            <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          Ayarları Kalıcı Olarak Kaydet
        </button>
      </div>
    </div>
  );
};

export default PlatformSettings;
