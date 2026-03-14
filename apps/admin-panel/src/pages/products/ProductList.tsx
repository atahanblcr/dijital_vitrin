import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Search, Image as ImageIcon, Trash2, Edit2, PackageX, TrendingUp, ListOrdered } from 'lucide-react';
import { toast } from 'sonner';
import ProductForm from './ProductForm';
import ProductSort from './ProductSort';

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/business/products');
      setProducts(res.data.data);
    } catch (error) {
      toast.error('Ürünler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFormOpen) {
      fetchProducts();
    }
  }, [isFormOpen]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" adlı ürünü tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
    try {
      await api.delete(`/business/products/${id}`);
      toast.success('Ürün silindi');
      fetchProducts();
    } catch (error: any) {
      toast.error('Silinemedi');
    }
  };

  if (isFormOpen) {
    return (
      <ProductForm 
        initialData={editingProduct}
        onBack={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }} 
        onSuccess={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }} 
      />
    );
  }

  if (isSortOpen) {
    return <ProductSort onBack={() => setIsSortOpen(false)} />;
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Ürün Yönetimi</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsSortOpen(true)}
            className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 flex items-center justify-center font-medium transition-colors"
          >
            <ListOrdered className="w-5 h-5 mr-2 text-gray-400" /> Sıralama
          </button>
          <button 
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="flex-1 sm:flex-none bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 flex items-center justify-center font-medium shadow-sm transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" /> Yeni Ürün Ekle
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        
        {/* Araç Çubuğu */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Ürün adı ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-sm"
            />
          </div>
        </div>

        {/* Tablo */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase text-gray-500 bg-gray-50 border-b border-gray-200 font-medium">
              <tr>
                <th className="px-6 py-4">Ürün</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Durumlar</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10">Yükleniyor...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-gray-500">Ürün bulunamadı.</td></tr>
              ) : (
                filteredProducts.map((product) => {
                  const mainImage = product.images?.find((i: any) => i.is_primary) || product.images?.[0];
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {mainImage ? (
                            <img src={mainImage.url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 max-w-[250px] truncate">{product.short_desc || 'Açıklama yok'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
                          {product.category?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-y-2">
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold border ${product.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                            {product.is_active ? 'VİTRİNDE' : 'GİZLİ'}
                          </span>
                          {!product.in_stock && (
                            <span className="px-2 py-1 rounded text-xs font-bold border bg-red-50 text-red-700 border-red-200 flex items-center">
                              <PackageX className="w-3 h-3 mr-1" /> TÜKENDİ
                            </span>
                          )}
                          {product.is_campaign && (
                            <span className="px-2 py-1 rounded text-xs font-bold border bg-orange-50 text-orange-700 border-orange-200 flex items-center">
                              <TrendingUp className="w-3 h-3 mr-1" /> KAMPANYA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            title="Düzenle"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsFormOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id, product.name)}
                            title="Sil"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
