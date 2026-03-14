'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { GripVertical, Save, ArrowLeft, Shuffle, ListOrdered } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ product }: { product: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const mainImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white border rounded-xl mb-2 shadow-sm ${isDragging ? 'opacity-50 scale-105 border-orange-500 shadow-xl' : 'hover:border-orange-200'}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded">
        <GripVertical className="text-gray-400" />
      </div>
      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border flex-shrink-0">
        {mainImage ? (
          <img src={mainImage.url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Görsel Yok</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 truncate">{product.name}</p>
        <p className="text-xs text-gray-400 capitalize">{product.category?.name}</p>
      </div>
    </div>
  );
};

const ProductSort = ({ onBack }: { onBack: () => void }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sortMode, setSortMode] = useState<'random' | 'manual'>('random');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, bizRes] = await Promise.all([
          api.get('/business/products'),
          api.get('/business/me') // Kendi işletme bilgilerini al (sort_mode için)
        ]);
        setProducts(prodRes.data.data);
        setSortMode(bizRes.data.data.product_sort_mode);
      } catch (error) {
        toast.error('Veriler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      if (sortMode === 'random') {
        setSortMode('manual');
        toast.info('Sıralama modu "Manuel" olarak değiştirildi.');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Sıralama modunu güncelle
      await api.put('/business/settings', { product_sort_mode: sortMode });
      
      // 2. Eğer manuel moddaysa sıraları gönder
      if (sortMode === 'manual') {
        const orders = products.map((p, index) => ({ id: p.id, sort_order: index }));
        await api.put('/business/products/sort-order', { orders });
      }
      
      toast.success('Sıralama başarıyla kaydedildi');
      onBack();
    } catch (error) {
      toast.error('Kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-medium italic">Ürünler listeleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-800 flex items-center gap-2 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" /> Geri Dön
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Ürün Sıralaması</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">SIRALAMA MODU</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSortMode('random')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${sortMode === 'random' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 hover:border-gray-200 text-gray-500'}`}
          >
            <Shuffle className="mb-2" />
            <span className="font-bold">Karışık (Random)</span>
            <span className="text-[10px] opacity-70">Her yüklemede değişir</span>
          </button>
          <button
            onClick={() => setSortMode('manual')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${sortMode === 'manual' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 hover:border-gray-200 text-gray-500'}`}
          >
            <ListOrdered className="mb-2" />
            <span className="font-bold">Manuel Sıralama</span>
            <span className="text-[10px] opacity-70">Sizin belirlediğiniz sıra</span>
          </button>
        </div>
      </div>

      <div className={`transition-opacity duration-300 ${sortMode === 'random' ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex justify-between items-center">
          ÜRÜN LİSTESİ (Sürükleyip Bırakın)
          {sortMode === 'random' && <span className="text-[10px] text-orange-500 font-black">RANDOM MODDA SIRA ETKİSİZDİR</span>}
        </p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
            {products.map((product) => (
              <SortableItem key={product.id} product={product} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl shadow-2xl shadow-orange-500/40 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          {saving ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              Sıralamayı Kaydet
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductSort;
