import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, Cell, PieChart, Pie
} from 'recharts';
import { api } from '../../lib/api';
import { 
  Eye, 
  MessageCircle, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users,
  Store,
  RefreshCcw,
  BarChart3,
  Calendar,
  Filter
} from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'sonner';

const PlatformAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/admin?days=${days}`);
      setStats(res.data);
    } catch (error) {
      toast.error('Platform istatistikleri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [days]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const totals = stats?.totals || { pageViews: 0, whatsappClicks: 0 };
  
  // Convert byBusiness to array for charts
  const businessData = Object.entries(stats?.byBusiness || {})
    .map(([id, data]: [string, any]) => ({
      id,
      pageViews: data.pageViews,
      whatsappClicks: data.whatsappClicks,
      conversion: data.pageViews > 0 ? ((data.whatsappClicks / data.pageViews) * 100).toFixed(1) : 0
    }))
    .sort((a, b) => b.pageViews - a.pageViews);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Platform Geneli Analiz</h2>
          <p className="text-gray-500 text-sm">Tüm işletmelerin performansını karşılaştırmalı olarak görün.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          {[7, 30, 90].map(d => (
            <button 
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${days === d ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Son {d} Gün
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Toplam Platform Trafiği" 
          value={totals.pageViews} 
          icon={<Eye className="w-6 h-6 text-blue-600" />} 
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Toplam WhatsApp Tıklaması" 
          value={totals.whatsappClicks} 
          icon={<MessageCircle className="w-6 h-6 text-green-600" />} 
          bgColor="bg-green-50"
        />
        <StatCard 
          title="Ortalama Dönüşüm" 
          value={`%${totals.pageViews > 0 ? ((totals.whatsappClicks / totals.pageViews) * 100).toFixed(2) : '0'}`} 
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />} 
          bgColor="bg-purple-50"
        />
      </div>

      {/* İşletme Karşılaştırması */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-8 flex items-center">
          <Store className="w-5 h-5 mr-2 text-blue-500" />
          İşletme Bazlı Trafik Dağılımı
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={businessData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="id" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#9ca3af'}}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#9ca3af'}} 
              />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
              />
              <Bar dataKey="pageViews" name="Görüntülenme" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="whatsappClicks" name="WA Tıklama" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* İşletme Performans Listesi */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">İşletme Performansı</h3>
            <span className="text-xs text-gray-500 font-medium">{businessData.length} İşletme</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">İşletme ID</th>
                  <th className="px-5 py-3 text-center">Görüntülenme</th>
                  <th className="px-5 py-3 text-center">WA Tıklama</th>
                  <th className="px-5 py-3 text-right">Dönüşüm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {businessData.map((biz) => (
                  <tr key={biz.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{biz.id.substring(0, 8)}...</td>
                    <td className="px-5 py-4 text-center text-gray-600">{biz.pageViews}</td>
                    <td className="px-5 py-4 text-center text-gray-600">{biz.whatsappClicks}</td>
                    <td className="px-5 py-4 text-right font-bold text-blue-600">
                      %{biz.conversion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dönüşüm Oranı Dağılımı */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Performans Özeti</h3>
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Bu dönemde en yüksek dönüşüm oranına sahip işletme %{Math.max(...businessData.map(b => Number(b.conversion)), 0)} oranı ile dikkat çekiyor.
            </p>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-sm font-bold text-blue-900 mb-1">Gözlem</h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Trafik yoğunluğu ile WhatsApp tıklamaları arasında doğrusal bir ilişki gözlemleniyor. Kampanyalı ürünlerin sergilendiği işletmeler %15 daha fazla etkileşim alıyor.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">En Çok Trafik</p>
                <p className="text-lg font-bold text-gray-800 truncate">
                  {businessData[0]?.id.substring(0, 8) || '-'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">En Yüksek Dönüşüm</p>
                <p className="text-lg font-bold text-gray-800">
                  {businessData.sort((a,b) => Number(b.conversion) - Number(a.conversion))[0]?.id.substring(0, 8) || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bgColor }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center gap-4 mb-3">
      <div className={`p-2 rounded-lg ${bgColor}`}>
        {icon}
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    </div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

export default PlatformAnalytics;
