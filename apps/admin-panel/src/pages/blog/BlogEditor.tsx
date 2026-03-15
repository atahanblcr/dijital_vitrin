import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Save, Calendar, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../lib/api';
import { toast } from 'sonner';

const blogSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur').max(150, 'Max 150 karakter'),
  content: z.string().min(1, 'İçerik boş bırakılamaz'),
  cover_image_url: z.string().url('Geçerli bir URL giriniz').optional().nullable().or(z.literal('')),
  meta_description: z.string().max(160, 'Max 160 karakter').optional().nullable(),
  status: z.enum(['draft', 'published']),
  published_at: z.string().optional().nullable() // yyyy-MM-ddThh:mm form formatı
});

type BlogForm = z.infer<typeof blogSchema>;

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Resim URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex items-center gap-1 border-b border-gray-300 p-2 bg-gray-50 rounded-t-lg">
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 text-sm font-bold rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-2 py-1 text-sm font-bold rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}>H3</button>
      <div className="w-px h-5 bg-gray-300 mx-1"></div>
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}><Bold className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}><Italic className="w-4 h-4" /></button>
      <div className="w-px h-5 bg-gray-300 mx-1"></div>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}><List className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}><ListOrdered className="w-4 h-4" /></button>
      <div className="w-px h-5 bg-gray-300 mx-1"></div>
      <button type="button" onClick={() => {
          const url = window.prompt('URL:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} 
        className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200 text-blue-600' : ''}`}
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button type="button" onClick={addImage} className="p-1.5 rounded hover:bg-gray-200">
        <ImageIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

const BlogEditor = ({ onBack, onSuccess, initialData }: { onBack: () => void, onSuccess: () => void, initialData?: any }) => {
  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      content: initialData.content,
      cover_image_url: initialData.cover_image_url || '',
      meta_description: initialData.meta_description,
      status: initialData.status,
      published_at: initialData.published_at ? new Date(initialData.published_at).toISOString().substring(0, 16) : null
    } : { status: 'draft', content: '', cover_image_url: '' }
  });

  const editor = useEditor({
    extensions: [
      StarterKit, 
      Link.configure({ openOnClick: false }),
      TiptapImage.configure({
        allowBase64: true,
      })
    ],
    content: initialData?.content || '',
    onUpdate: ({ editor }) => {
      setValue('content', editor.getHTML(), { shouldValidate: true });
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] p-4 bg-white',
      },
    },
  });

  const onSubmit = async (data: BlogForm) => {
    try {
      const payload = {
        ...data,
        published_at: data.published_at ? new Date(data.published_at).toISOString() : null
      };

      if (initialData) {
        await api.put(`/business/blog/${initialData.id}`, payload);
        toast.success('Yazı güncellendi');
      } else {
        await api.post('/business/blog', payload);
        toast.success(data.status === 'published' ? 'Yazı yayınlandı' : 'Taslak olarak kaydedildi');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Kayıt başarısız');
    }
  };

  const status = watch('status');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-800">← Listeye Dön</button>
        <h2 className="text-2xl font-bold text-gray-800">{initialData ? 'Yazıyı Düzenle' : 'Yeni Blog / Duyuru'}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sol Alan: Editör */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-1">
            <input 
              {...register('title')} 
              placeholder="Yazı Başlığı" 
              className={`w-full text-2xl font-bold px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Kapak Görseli URL</label>
            <input 
              {...register('cover_image_url')} 
              placeholder="https://... (Örn: Cloudinary linki)" 
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${errors.cover_image_url ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.cover_image_url && <p className="text-xs text-red-500">{errors.cover_image_url.message}</p>}
          </div>

          <div className={`border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-500/30 ${errors.content ? 'border-red-500' : 'border-gray-300'}`}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>
          {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Kısa Meta Açıklama (SEO için)</label>
            <textarea 
              {...register('meta_description')} 
              rows={2}
              placeholder="Google aramalarında görünecek özet..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>
        </div>

        {/* Sağ Alan: Yayın Ayarları */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-6">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Yayın Ayarları</h3>
          
          <div className="space-y-3">
            <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${status === 'draft' ? 'bg-orange-50 border-orange-200 text-orange-800' : 'hover:bg-gray-50 text-gray-700'}`}>
              <input type="radio" value="draft" {...register('status')} className="mr-3 text-orange-500 focus:ring-orange-500" />
              <Save className="w-4 h-4 mr-2" /> Taslak Kaydet
            </label>
            
            <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${status === 'published' ? 'bg-green-50 border-green-200 text-green-800' : 'hover:bg-gray-50 text-gray-700'}`}>
              <input type="radio" value="published" {...register('status')} className="mr-3 text-green-500 focus:ring-green-500" />
              <CheckCircle className="w-4 h-4 mr-2" /> Hemen Yayınla
            </label>
          </div>

          <div className="space-y-1.5 pt-2 border-t">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" /> İleri Tarihli Yayın (Opsiyonel)
            </label>
            <input 
              type="datetime-local" 
              {...register('published_at')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
            <p className="text-xs text-gray-400">Boş bırakılırsa onaylandığı an yayınlanır.</p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-70"
          >
            {isSubmitting ? 'İşleniyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default BlogEditor;
