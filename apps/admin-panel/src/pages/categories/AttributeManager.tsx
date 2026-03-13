import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Bu bileşen CategoryList üzerinden seçilen kategoriye ait özellikleri yönetir.
// Geliştirme kolaylığı için prop üzerinden categoryId alacak şekilde tasarlandı.
interface AttributeManagerProps {
  categoryId: string;
  categoryName: string;
  onBack: () => void;
}

const AttributeManager: React.FC<AttributeManagerProps> = ({ categoryId, categoryName, onBack }) => {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-800">
          ← Geri Dön
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          <span className="text-orange-500">{categoryName}</span> Özellikleri
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Bölümü */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-1 h-fit">
          <h3 className="font-semibold text-gray-800 mb-4">Yeni Özellik Ekle</h3>
          <form onSubmit={handleAddAttribute} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Özellik Adı (Örn: Renk, Beden)</label>
              <input 
                value={name} onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Veri Tipi</label>
              <select 
                value={type} onChange={e => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="text">Metin (Serbest Yazı)</option>
                <option value="number">Sayısal Değer</option>
                <option value="select">Çoktan Seçmeli (Liste)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="req" checked={isRequired} onChange={e => setIsRequired(e.target.checked)} className="rounded text-orange-500 focus:ring-orange-500" />
              <label htmlFor="req" className="text-sm text-gray-700">Bu alan zorunlu olsun</label>
            </div>

            {type === 'select' && (
              <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
                <input type="checkbox" id="mult" checked={isMultiple} onChange={e => setIsMultiple(e.target.checked)} className="rounded text-orange-500 focus:ring-orange-500" />
                <label htmlFor="mult" className="text-sm text-orange-800 font-medium">Birden fazla seçim yapılabilsin</label>
              </div>
            )}

            <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Ekle
            </button>
          </form>
        </div>

        {/* Liste Bölümü */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4">Mevcut Özellikler</h3>
          
          <div className="space-y-3">
            {attributes.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center border border-dashed border-gray-300 rounded-lg">Bu kategoriye ait özellik bulunmuyor.</p>
            ) : (
              attributes.map(attr => (
                <div key={attr.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{attr.name}</span>
                      {attr.is_required && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-medium">Zorunlu</span>}
                    </div>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      TİP: {attr.type === 'select' ? (attr.is_multiple ? 'ÇOKLU SEÇİM' : 'TEKLİ SEÇİM') : attr.type}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteAttribute(attr.id, attr.name)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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
