import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Store, 
  Eye, 
  MessageCircle, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCcw, 
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [analyticsRes, businessesRes] = await Promise.all([
        api.get('/analytics/admin?days=30'),
        api.get('/admin/businesses')
      ]);

      const businesses = businessesRes.data?.data || [];
      const activeCount = businesses.filter((b: any) => b.is_active).length;
      const expiringCount = businesses.filter((b: any) => {
        if (!b.subscription_end) return false;
        const endDate = new Date(b.subscription_end);
        const today = new Date();
        const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      }).length;

      setStats({
        platform: analyticsRes.data?.totals || { pageViews: 0, whatsappClicks: 0 },
        businessAnalytics: analyticsRes.data?.byBusiness || {},
        counts: {
          total: businesses.length,
          active: activeCount,
          expiring: expiringCount
        },
        businesses: businesses
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-gray-500 animate-pulse">Veriler yükleniyor...</p>
      </div>
    );
  }

  if (!stats) {
    return <div className="p-8 text-center text-red-500">Veri alınamadı. Lütfen sayfayı yenileyin.</div>;
  }

  // Bar chart data
  const barData = Object.entries(stats.businessAnalytics || {})
    .map(([bizId, data]: [string, any]) => {
      const biz = stats.businesses.find((b: any) => b.id === bizId);
      return {
        name: biz?.name || 'Bilinmeyen',
        görüntülenme: data.pageViews || 0
      };
    })
    .sort((a, b) => b.görüntülenme - a.görüntülenme)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Süper Admin Dashboard</h2>
          <p className="text-gray-500 text-sm">Tüm platform genelindeki aktiviteleri yönetin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Toplam İşletme" 
          value={stats.counts.total} 
          icon={<Store className="w-6 h-6 text-blue-600" />} 
          bgColor="bg-blue-50" 
        />
        <SummaryCard 
          title="Aktif İşletme" 
          value={stats.counts.active} 
          icon={<Users className="w-6 h-6 text-green-600" />} 
          bgColor="bg-green-50" 
        />
        <SummaryCard 
          title="Aboneliği Azalanlar" 
          value={stats.counts.expiring} 
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />} 
          bgColor="bg-red-50" 
          warning={stats.counts.expiring > 0}
        />
        <SummaryCard 
          title="Platform Trafiği" 
          value={stats.platform.pageViews} 
          icon={<Eye className="w-6 h-6 text-purple-600" />} 
          bgColor="bg-purple-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-8 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            En Popüler İşletmeler
          </h3>
          <div className="h-[300px] w-full">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} />
                  <Bar dataKey="görüntülenme" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">Henüz trafik verisi yok.</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Etkileşimler</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{stats.platform.whatsappClicks}</p>
                  <p className="text-xs text-gray-500">WA Tıklaması</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-10 italic">
              Platform genelinde son 30 gün verileri gösterilmektedir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, bgColor, warning }: any) => (
  <div className={`bg-white p-6 rounded-xl border ${warning ? 'border-red-200 bg-red-50/10' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bgColor}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
