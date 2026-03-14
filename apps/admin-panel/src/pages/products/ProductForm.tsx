import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import ImageUploader from '../../components/product/ImageUploader';
import AttributeFields from '../../components/product/AttributeFields';

// SKILL dokümanındaki kısıtlamalara birebir uygun Zod şeması
const productSchema = z.object({
  name: z.string().min(1, 'Ürün adı zorunludur').max(100, 'Maksimum 100 karakter olabilir'),
  category_id: z.string().min(1, 'Kategori seçimi zorunludur'),
  short_desc: z.string().max(150, 'Kısa açıklama en fazla 150 karakter olabilir').optional().nullable(),
  long_desc: z.string().optional().nullable(),
  is_campaign: z.boolean().default(false),
  in_stock: z.boolean().default(true),
  is_active: z.boolean().default(true),
  attributes: z.array(z.any()).default([])
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductForm = ({ onBack, onSuccess, initialData }: { onBack: () => void, onSuccess: () => void, initialData?: any }) => {
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [submitErrors, setSubmitErrors] = useState<any[]>([]);

  const { register, handleSubmit, control, watch, reset, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      category_id: initialData.category_id,
      short_desc: initialData.short_desc,
      long_desc: initialData.long_desc,
      is_campaign: initialData.is_campaign,
      in_stock: initialData.in_stock,
      is_active: initialData.is_active,
      attributes: initialData.attr_values?.map((av: any) => ({
        attribute_id: av.attribute_id,
        value: av.value_text || av.value_number || av.value_option_id
      })) || []
    } : { in_stock: true, is_active: true, is_campaign: false, attributes: [] }
  });

  const selectedCategory = watch('category_id');
  const nameLength = watch('name')?.length || 0;
  const shortDescLength = watch('short_desc')?.length || 0;

  useEffect(() => {
    api.get('/business/categories').then(res => setCategories(res.data.data)).catch(() => toast.error('Kategoriler alınamadı'));
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitErrors([]);
    try {
      let productId = initialData?.id;

      if (initialData) {
        // GÜNCELLEME
        await api.put(`/business/products/${productId}`, data);
      } else {
        // YENİ KAYIT
        const res = await api.post('/business/products', data);
        productId = res.data.data.id;
      }

      // 2. Eğer yeni görsel yüklendiyse (veya mevcutlar üzerinde işlem yapılacaksa Faz 2'de detaylandırılabilir)
      // Şimdilik sadece yeni görselleri ekliyoruz
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(img => formData.append('images', img));
        await api.post(`/business/products/${productId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success(initialData ? 'Ürün başarıyla güncellendi' : 'Ürün başarıyla kaydedildi');
      onSuccess();
    } catch (error: any) {
      if (error.response?.data?.details) {
        setSubmitErrors(error.response.data.details);
      } else {
        toast.error(error.response?.data?.error || 'İşlem başarısız');
      }
    }
  };

  const errorCount = Object.keys(errors).length + submitErrors.length;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-800 flex items-center gap-2 font-medium">
          <ArrowLeft className="w-5 h-5" /> Listeye Dön
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{initialData ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
      </div>

      {errorCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> 
            Formda {errorCount} alanda eksik veya hatalı bilgi var. Lütfen kontrol edin.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* TEMEL BİLGİLER */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Temel Bilgiler</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Ürün Adı <span className="text-red-500">*</span></label>
              <input
                {...register('name')}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              <div className="flex justify-between mt-1">
                {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : <div/>}
                <p className={`text-xs ${nameLength > 100 ? 'text-red-600 font-medium' : 'text-gray-400'}`}>{nameLength} / 100</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Kategori <span className="text-red-500">*</span></label>
              <select
                {...register('category_id')}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Kategori Seçin</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.category_id && <p className="text-xs text-red-600">{errors.category_id.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Kısa Açıklama (Ürün kartında görünür)</label>
            <textarea
              {...register('short_desc')}
              rows={2}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${errors.short_desc ? 'border-red-500' : 'border-gray-300'}`}
            />
            <div className="flex justify-between mt-1">
               {errors.short_desc ? <p className="text-xs text-red-600">{errors.short_desc.message}</p> : <div/>}
               <p className={`text-xs ${shortDescLength > 150 ? 'text-red-600 font-medium' : 'text-gray-400'}`}>{shortDescLength} / 150</p>
            </div>
          </div>
        </div>

        {/* KATEGORİ ÖZELLİKLERİ (DİNAMİK) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Ürün Özellikleri</h3>
          <Controller
            control={control}
            name="attributes"
            render={({ field }) => (
              <AttributeFields 
                categoryId={selectedCategory} 
                values={field.value} 
                onChange={field.onChange} 
                errors={submitErrors} 
              />
            )}
          />
        </div>

        {/* GÖRSELLER */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Görseller</h3>
          {initialData?.images && initialData.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-4">
               {initialData.images.map((img: any) => (
                 <div key={img.id} className="relative aspect-square rounded-lg border overflow-hidden">
                   <img src={img.url} alt="" className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          )}
          <ImageUploader images={images} onChange={setImages} maxFiles={7 - (initialData?.images?.length || 0)} />
        </div>

        {/* DURUM VE AYARLAR */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Görünüm Ayarları</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" {...register('in_stock')} className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500" />
              <div>
                <p className="font-medium text-gray-800">Stokta Var</p>
                <p className="text-xs text-gray-500">Pasif olursa "Tükendi" yazar</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors bg-orange-50/30">
              <input type="checkbox" {...register('is_campaign')} className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500" />
              <div>
                <p className="font-medium text-orange-800">Kampanya Ürünü</p>
                <p className="text-xs text-orange-600/70">Anasayfa carousel'ına ekler</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" {...register('is_active')} className="w-5 h-5 text-green-500 rounded focus:ring-green-500" />
              <div>
                <p className="font-medium text-gray-800">Vitrin Durumu</p>
                <p className="text-xs text-gray-500">Pasif olursa vitrinde görünmez</p>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isSubmitting ? 'Kaydediliyor...' : initialData ? 'Değişiklikleri Kaydet' : 'Ürünü Kaydet ve Yayınla'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
