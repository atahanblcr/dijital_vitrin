import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface BusinessFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  title: string;
}

const BusinessForm: React.FC<BusinessFormProps> = ({ initialData, onSubmit, onClose, title }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    sector: initialData?.sector || 'butik',
    whatsapp: initialData?.whatsapp || '+90',
    subscription_plan: initialData?.subscription_plan || 'monthly',
    subscription_end: initialData?.subscription_end ? new Date(initialData.subscription_end).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      // Hata zaten üst katmanda yönetiliyor (toast vb.)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl my-auto animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">İşletme Adı *</label>
              <input 
                required 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                placeholder="Örn: Ahmet Butik" 
              />
            </div>
            
            {!initialData && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subdomain (Slug) *</label>
                <div className="flex items-center">
                  <input 
                    required 
                    type="text" 
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    placeholder="ahmet-butik" 
                  />
                  <span className="ml-2 text-gray-400 text-sm italic">.dijitalvitrin.com</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sektör *</label>
              <select 
                value={formData.sector}
                onChange={e => setFormData({ ...formData, sector: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="butik">Butik</option>
                <option value="elektronik">Elektronik</option>
                <option value="aksesuar">Aksesuar</option>
                <option value="el_isi">El İşi</option>
                <option value="oto_galeri">Oto Galeri</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp *</label>
              <input 
                required 
                type="text" 
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                placeholder="+905..." 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Abonelik Planı</label>
              <select 
                value={formData.subscription_plan}
                onChange={e => setFormData({ ...formData, subscription_plan: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="monthly">Aylık</option>
                <option value="yearly">Yıllık</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bitiş Tarihi</label>
              <input 
                type="date" 
                value={formData.subscription_end}
                onChange={e => setFormData({ ...formData, subscription_end: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
            </div>
          </div>

          {!initialData && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Admin Hesabı Bilgileri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kullanıcı Adı *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    placeholder="admin_ahmet" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Şifre *</label>
                  <input 
                    required 
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    placeholder="********" 
                  />
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {initialData ? 'Değişiklikleri Kaydet' : 'İşletmeyi Kaydet ve Başlat'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;
