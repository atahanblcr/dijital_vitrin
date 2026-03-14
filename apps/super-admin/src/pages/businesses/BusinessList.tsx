import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Search, Store, ExternalLink, Calendar, Trash2, Edit2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import BusinessForm from './BusinessForm';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<any>(null);

  const fetchBusinesses = async () => {
    setLoading(true);
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

  const handleCreateOrUpdate = async (formData: any) => {
    try {
      if (editingBusiness) {
        await api.put(`/admin/businesses/${editingBusiness.id}`, formData);
        toast.success('İşletme güncellendi');
      } else {
        await api.post('/admin/businesses', formData);
        toast.success('İşletme ve admin hesabı başarıyla oluşturuldu');
      }
      setIsFormOpen(false);
      setEditingBusiness(null);
      fetchBusinesses();
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Bir hata oluştu';
      toast.error(msg);
      throw error;
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" işletmesini ve ona ait TÜM verileri (ürünler, kategoriler, bloglar) silmek istediğinize emin misiniz?`)) return;
    
    try {
      await api.delete(`/admin/businesses/${id}`);
      toast.success('İşletme tamamen silindi');
      fetchBusinesses();
    } catch (error) {
      toast.error('Silme işlemi başarısız');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await api.patch(`/admin/businesses/${id}/toggle`);
      toast.success('Durum güncellendi');
      setBusinesses(prev => prev.map(b => b.id === id ? { ...b, is_active: !b.is_active } : b));
    } catch (error) {
      toast.error('Güncellenemedi');
    }
  };

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">İşletme Yönetimi</h2>
          <p className="text-gray-500 text-sm">Platformdaki tüm işletmeleri buradan yönetebilirsiniz.</p>
        </div>
        <button 
          onClick={() => {
            setEditingBusiness(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 flex items-center font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 mr-2" /> Yeni İşletme Ekle
        </button>
      </div>

      {isFormOpen && (
        <BusinessForm 
          title={editingBusiness ? 'İşletme Düzenle' : 'Yeni İşletme Kaydı'}
          initialData={editingBusiness}
          onClose={() => {
            setIsFormOpen(false);
            setEditingBusiness(null);
          }}
          onSubmit={handleCreateOrUpdate}
        />
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center bg-gray-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="İşletme adı veya subdomain ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase text-gray-400 bg-gray-50/50 border-b border-gray-100 font-bold text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">İşletme Bilgileri</th>
                <th className="px-6 py-4">Sektör</th>
                <th className="px-6 py-4">Abonelik</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                      <p className="text-gray-400 font-medium italic">İşletmeler yükleniyor...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <div className="flex flex-col items-center text-gray-400">
                      <Store className="w-12 h-12 mb-3 opacity-20" />
                      <p className="font-medium">Henüz bir işletme bulunmuyor.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBusinesses.map((biz) => (
                  <tr key={biz.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 group-hover:scale-110 transition-transform shadow-sm">
                          {biz.logo_url ? (
                            <img src={biz.logo_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <Store className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{biz.name}</p>
                          <a 
                            href={`https://${biz.slug}.dijitalvitrin.com`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs text-blue-500 hover:text-blue-700 flex items-center mt-0.5 font-medium underline-offset-2 hover:underline"
                          >
                            {biz.slug}.dijitalvitrin.com
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                        {biz.sector.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center text-gray-700 font-semibold mb-1">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {biz.subscription_end ? format(new Date(biz.subscription_end), 'd MMMM yyyy', { locale: tr }) : '-'}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-6">
                          {biz.subscription_plan === 'monthly' ? 'AYLIK PLAN' : 'YILLIK PLAN'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleActive(biz.id)}
                        className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          biz.is_active 
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        {biz.is_active ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : (
                          <ShieldAlert className="w-4 h-4" />
                        )}
                        {biz.is_active ? 'AKTİF' : 'PASİF'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingBusiness(biz);
                            setIsFormOpen(true);
                          }}
                          className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" 
                          title="Düzenle"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(biz.id, biz.name)}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" 
                          title="Sil"
                        >
                          <Trash2 className="w-5 h-5" />
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
