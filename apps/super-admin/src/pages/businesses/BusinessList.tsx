import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Search, Store, ExternalLink, Calendar, Trash2, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sector: 'butik',
    whatsapp: '+90',
    theme_primary: '#2563eb',
    theme_accent: '#3b82f6',
    subscription_plan: 'monthly'
  });

  const fetchBusinesses = async () => {
    try {
      const res = await api.get('/admin/businesses');
      setBusinesses(res.data.data || []);
    } catch (error) {
      toast.error('İşletmeler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Not: API'de henüz POST /admin/businesses endpoint'ini tam yazmadık ama 
      // arayüzde çalışması için şimdilik simüle ediyoruz veya hata verirse yakalıyoruz
      toast.info('İşletme ekleme özelliği API tarafında tamamlanıyor...');
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Eklenemedi');
    }
  };

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">İşletme Yönetimi</h2>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 flex items-center font-medium shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Yeni İşletme Ekle
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Yeni İşletme Kaydı</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İşletme Adı</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Örn: Ahmet Butik" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain (Slug)</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="ahmet-butik" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sektör</label>
                  <select className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="butik">Butik</option>
                    <option value="elektronik">Elektronik</option>
                    <option value="oto_galeri">Oto Galeri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input required type="text" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" defaultValue="+90" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors pt-4">
                İşletmeyi Oluştur
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="İşletme adı veya subdomain ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase text-gray-500 bg-gray-50 border-b border-gray-200 font-medium">
              <tr>
                <th className="px-6 py-4">İşletme</th>
                <th className="px-6 py-4">Sektör</th>
                <th className="px-6 py-4">Abonelik Bitiş</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400 italic">Yükleniyor...</td></tr>
              ) : filteredBusinesses.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500 font-medium">İşletme bulunamadı.</td></tr>
              ) : (
                filteredBusinesses.map((biz) => (
                  <tr key={biz.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{biz.name}</p>
                          <p className="text-xs text-gray-400 flex items-center">
                            {biz.slug}.dijitalvitrin.com
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{biz.sector}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 opacity-40" />
                        {biz.subscription_end ? format(new Date(biz.subscription_end), 'd MMM yyyy', { locale: tr }) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${biz.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {biz.is_active ? 'AKTİF' : 'PASİF'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Düzenle">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Sil">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessList;
