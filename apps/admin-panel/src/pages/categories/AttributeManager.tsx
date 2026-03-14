import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Trash2, Plus, List, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AttributeManagerProps {
  categoryId: string;
  categoryName: string;
  onBack: () => void;
}

const OptionEditor = ({ attr, categoryId, onUpdate }: { attr: any, categoryId: string, onUpdate: () => void }) => {
  const [newValue, setNewValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddOption = async () => {
    if (!newValue.trim()) return;
    setLoading(true);
    try {
      await api.post(`/business/categories/${categoryId}/attributes/${attr.id}/options`, { value: newValue });
      setNewValue('');
      onUpdate();
    } catch (error) {
      toast.error('Seçenek eklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOption = async (optId: string) => {
    try {
      await api.delete(`/business/categories/${categoryId}/attributes/${attr.id}/options/${optId}`);
      onUpdate();
    } catch (error) {
      toast.error('Seçenek silinemedi');
    }
  };

  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">SEÇENEKLER (Liste)</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {attr.options?.map((opt: any) => (
          <div key={opt.id} className="bg-white border border-gray-200 pl-3 pr-1 py-1 rounded-full flex items-center gap-2 text-sm text-gray-700 shadow-sm group">
            {opt.value}
            <button 
              onClick={() => handleDeleteOption(opt.id)}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {(!attr.options || attr.options.length === 0) && (
          <p className="text-xs text-gray-400 italic">Henüz seçenek eklenmemiş.</p>
        )}
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <input 
          type="text" 
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          placeholder="Yeni seçenek (örn: Kırmızı)"
          className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          onKeyDown={e => e.key === 'Enter' && handleAddOption()}
        />
        <button 
          onClick={handleAddOption}
          disabled={loading || !newValue.trim()}
          className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-orange-200 transition-colors disabled:opacity-50"
        >
          <Plus size={16} className="inline mr-1" /> Ekle
        </button>
      </div>
    </div>
  );
};

const AttributeManager: React.FC<AttributeManagerProps> = ({ categoryId, categoryName, onBack }) => {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOptionId, setOpenOptionId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [isRequired, setIsRequired] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);

  const fetchAttributes = async () => {
    try {
      const res = await api.get(`/business/categories/${categoryId}/attributes`);
      setAttributes(res.data.data);
    } catch (error) {
      toast.error('Özellikler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, [categoryId]);

  const handleAddAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await api.post(`/business/categories/${categoryId}/attributes`, {
        name,
        type,
        is_required: isRequired,
        is_multiple: isMultiple
      });
      toast.success('Özellik başarıyla eklendi');
      setName('');
      setType('text');
      setIsRequired(false);
      setIsMultiple(false);
      fetchAttributes();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Eklenemedi');
    }
  };

  const handleDeleteAttribute = async (attrId: string, attrName: string) => {
    if (!confirm(`"${attrName}" özelliğini silmek üzeresiniz. Bu işlem bu kategoriye ait tüm ürünlerdeki bu veri alanını kalıcı olarak silecektir. Devam edilsin mi?`)) return;

    try {
      await api.delete(`/business/categories/${categoryId}/attributes/${attrId}`);
      toast.success('Özellik silindi');
      fetchAttributes();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Silinemedi');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors flex items-center shadow-sm">
          ← Geri Dön
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          <span className="text-orange-500">{categoryName}</span> Özellikleri
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Bölümü */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-1 h-fit sticky top-6">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="text-orange-500" size={20} />
            Yeni Özellik Ekle
          </h3>
          <form onSubmit={handleAddAttribute} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase">Özellik Adı</label>
              <input 
                placeholder="Örn: Renk, Beden, Malzeme"
                value={name} onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase">Veri Tipi</label>
              <select 
                value={type} onChange={e => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white"
              >
                <option value="text">Metin (Serbest Yazı)</option>
                <option value="number">Sayısal Değer</option>
                <option value="select">Çoktan Seçmeli (Liste)</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={isRequired} onChange={e => setIsRequired(e.target.checked)} className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500" />
                <span className="text-sm font-medium text-gray-700">Bu alan zorunlu olsun</span>
              </label>

              {type === 'select' && (
                <label className="flex items-center gap-3 p-3 border border-orange-100 bg-orange-50/50 rounded-xl cursor-pointer hover:bg-orange-50 transition-colors animate-in slide-in-from-left-2 duration-200">
                  <input type="checkbox" checked={isMultiple} onChange={e => setIsMultiple(e.target.checked)} className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500" />
                  <span className="text-sm font-bold text-orange-800">Birden fazla seçim yapılabilsin</span>
                </label>
              )}
            </div>

            <button type="submit" className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-black shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all active:scale-95">
              Özelliği Oluştur
            </button>
          </form>
        </div>

        {/* Liste Bölümü */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <List className="text-blue-500" size={20} />
            Mevcut Özellikler
          </h3>
          
          <div className="space-y-4">
            {attributes.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl">
                <p className="text-gray-400 font-medium italic text-sm">Bu kategori için henüz bir özellik tanımlanmamış.</p>
              </div>
            ) : (
              attributes.map(attr => (
                <div key={attr.id} className={`border rounded-2xl transition-all duration-300 ${openOptionId === attr.id ? 'border-blue-200 shadow-md' : 'border-gray-100 hover:border-gray-300'}`}>
                  <div className="p-5 flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-black text-gray-900 text-lg">{attr.name}</span>
                        {attr.is_required && <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-black border border-red-100 uppercase tracking-tighter">ZORUNLU</span>}
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                          TİP: {attr.type === 'select' ? (attr.is_multiple ? 'ÇOKLU SEÇİM' : 'TEKLİ SEÇİM') : attr.type}
                        </p>
                        {attr.type === 'select' && (
                          <span className="text-[10px] text-blue-600 font-bold">
                            {attr.options?.length || 0} Seçenek
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {attr.type === 'select' && (
                        <button 
                          onClick={() => setOpenOptionId(openOptionId === attr.id ? null : attr.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${openOptionId === attr.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                        >
                          <List size={14} />
                          {openOptionId === attr.id ? 'Listeyi Kapat' : 'Seçenekleri Yönet'}
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteAttribute(attr.id, attr.name)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {attr.type === 'select' && openOptionId === attr.id && (
                    <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                      <OptionEditor attr={attr} categoryId={categoryId} onUpdate={fetchAttributes} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AttributeManager;
