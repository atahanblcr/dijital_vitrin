import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Edit2, Trash2, Globe, FileEdit, Clock } from 'lucide-react';
import { toast } from 'sonner';
import BlogEditor from './BlogEditor';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const BlogList = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/business/blog');
      setBlogs(res.data.data);
    } catch (error) {
      toast.error('Yazılar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isEditorOpen) fetchBlogs();
  }, [isEditorOpen]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" adlı yazıyı silmek istediğinize emin misiniz?`)) return;
    try {
      await api.delete(`/business/blog/${id}`);
      toast.success('Yazı silindi');
      fetchBlogs();
    } catch (error) {
      toast.error('Silinemedi');
    }
  };

  if (isEditorOpen) {
    return <BlogEditor onBack={() => setIsEditorOpen(false)} onSuccess={() => setIsEditorOpen(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Blog & Duyuru Yönetimi</h2>
        <button 
          onClick={() => setIsEditorOpen(true)}
          className="bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 flex items-center font-medium shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Yeni Yazı Ekle
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase text-gray-500 bg-gray-50 border-b border-gray-200 font-medium">
              <tr>
                <th className="px-6 py-4">Yazı Başlığı</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4">Yayın Tarihi</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10">Yükleniyor...</td></tr>
              ) : blogs.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-gray-500">Henüz yazı bulunmuyor.</td></tr>
              ) : (
                blogs.map((blog) => {
                  const isFuture = blog.status === 'published' && blog.published_at && new Date(blog.published_at) > new Date();

                  return (
                    <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 max-w-sm truncate">{blog.title}</p>
                        <p className="text-xs text-gray-400">/{blog.slug}</p>
                      </td>
                      <td className="px-6 py-4">
                        {blog.status === 'draft' ? (
                          <span className="flex items-center gap-1.5 text-orange-700 bg-orange-50 border border-orange-200 px-2 py-1 rounded text-xs font-bold w-fit">
                            <FileEdit className="w-3 h-3" /> TASLAK
                          </span>
                        ) : isFuture ? (
                          <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded text-xs font-bold w-fit">
                            <Clock className="w-3 h-3" /> ZAMANLANMIŞ
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded text-xs font-bold w-fit">
                            <Globe className="w-3 h-3" /> YAYINDA
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {blog.published_at 
                          ? format(new Date(blog.published_at), 'd MMM yyyy, HH:mm', { locale: tr })
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button title="Düzenle" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(blog.id, blog.title)}
                            title="Sil" className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

export default BlogList;
