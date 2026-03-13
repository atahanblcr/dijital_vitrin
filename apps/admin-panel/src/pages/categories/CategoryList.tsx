import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Trash2, Tags, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import AttributeManager from './AttributeManager';

interface Category {
  id: string;
  name: string;
  _count: { products: number };
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  
  // Özellik yönetimi moduna geçiş için state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/business/categories');
      setCategories(res.data.data);
    } catch (error) {
      toast.error('Kategoriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      await api.post('/business/categories', { name: newCatName });
      toast.success('Kategori eklendi');
      setNewCatName('');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Eklenemedi');
    }
  };

  const handleDelete = async (id: string, count: number) => {
    if (count > 0) {
      toast.error(`Bu kategoride ${count} ürün var. Önce ürünleri taşıyın.`);
      return;
    }
    
    if (!confirm('Kategoriyi silmek istediğinize emin misiniz?')) return;

    try {
      await api.delete(`/business/categories/${id}`);
      toast.success('Kategori silindi');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Silinemedi');
    }
  };

  if (loading) return <div className="text-gray-500">Yükleniyor...</div>;

  // Özellik yönetim ekranındaysak AttributeManager'i render et
  if (selectedCategory) {
    return (
      <AttributeManager 
        categoryId={selectedCategory.id} 
        categoryName={selectedCategory.name} 
        onBack={() => setSelectedCategory(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Kategoriler</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <form onSubmit={handleAddCategory} className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Yeni Kategori Adı"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 flex items-center font-medium"
          >
            <Plus className="w-5 h-5 mr-2" /> Ekle
          </button>
        </form>

        <div className="space-y-3">
          {categories.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Henüz kategori eklenmemiş.</div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Tags className="text-orange-400 w-5 h-5" />
                  <span className="font-medium text-gray-800">{cat.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {cat._count.products} Ürün
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg flex items-center text-sm font-medium"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    Özellikler <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(cat.id, cat._count.products)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                    title="Kategoriyi Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
