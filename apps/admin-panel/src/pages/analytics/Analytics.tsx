import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';
import { api } from '../../lib/api';
import { 
  Eye, 
  MessageCircle, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Filter,
  RefreshCcw,
  BarChart3,
  MousePointer2
} from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'sonner';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/business?days=${days}`);
      setStats(res.data);
    } catch (error) {
      toast.error('İstatistikler yüklenemedi');
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
        <RefreshCcw className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  const totals = stats?.totals || {
    pageViews: 0,
    uniqueVisitors: 0,
    productViews: 0,
    whatsappClicks: 0
  };

  const chartData = stats?.daily.map((d: any) => ({
    name: format(parseISO(d.date), 'd MMM', { locale: tr }),
    görüntülenme: d.page_views,
    wa_tıklama: d.whatsapp_clicks
  })) || [];

  const conversionRate = totals.pageViews > 0 
    ? ((totals.whatsappClicks / totals.pageViews) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">İstatistik ve Analiz</h2>
          <p className="text-gray-500 text-sm">İşletmenizin performansını gerçek zamanlı takip edin.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <button 
            onClick={() => setDays(7)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${days === 7 ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Son 7 Gün
          </button>
          <button 
            onClick={() => setDays(30)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${days === 30 ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Son 30 Gün
          </button>
          <button 
            onClick={() => setDays(90)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${days === 90 ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Son 90 Gün
          </button>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Toplam Sayfa Görüntülenme" 
          value={totals.pageViews} 
          icon={<Eye className="w-6 h-6 text-blue-600" />} 
          bgColor="bg-blue-50"
          trend="+12%"
          isUp={true}
        />
        <StatCard 
          title="Benzersiz Ziyaretçi" 
          value={totals.uniqueVisitors} 
          icon={<Filter className="w-6 h-6 text-purple-600" />} 
          bgColor="bg-purple-50"
          trend="+5%"
          isUp={true}
        />
        <StatCard 
          title="WhatsApp Tıklaması" 
          value={totals.whatsappClicks} 
          icon={<MessageCircle className="w-6 h-6 text-green-600" />} 
          bgColor="bg-green-50"
          trend="+8%"
          isUp={true}
        />
        <StatCard 
          title="Dönüşüm Oranı" 
          value={`%${conversionRate}`} 
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />} 
          bgColor="bg-orange-50"
          trend="-2%"
          isUp={false}
        />
      </div>

      {/* Ana Grafik */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-gray-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
            Ziyaretçi ve Etkileşim Trendi
          </h3>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Görüntülenme
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              WA Tıklama
            </div>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#9ca3af'}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#9ca3af'}} 
              />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
              />
              <Line 
                type="monotone" 
                dataKey="görüntülenme" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="wa_tıklama" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ürün Performans Tablosu */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-800">En Çok İlgi Gören Ürünler</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">Ürün</th>
                  <th className="px-5 py-3 text-center">Görüntülenme</th>
                  <th className="px-5 py-3 text-center">WA Tıklama</th>
                  <th className="px-5 py-3 text-right">Dönüşüm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1,2,3,4,5].map((i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">Örnek Ürün {i}</td>
                    <td className="px-5 py-4 text-center text-gray-600">{(150 / i).toFixed(0)}</td>
                    <td className="px-5 py-4 text-center text-gray-600">{(20 / i).toFixed(0)}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-bold">
                        %{(12 / i).toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ziyaretçi Cihaz Dağılımı (Örnek) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Cihaz Dağılımı</h3>
          <div className="h-[250px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>                <Pie
                  data={[
                    { name: 'Mobil', value: 75, color: '#f97316' },
                    { name: 'Masaüstü', value: 25, color: '#3b82f6' }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#f97316" />
                  <Cell fill="#3b82f6" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-800">%75</span>
              <span className="text-xs text-gray-500">Mobil</span>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-600">Mobil (%75)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Masaüstü (%25)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bgColor, trend, isUp }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${bgColor}`}>
        {icon}
      </div>
      <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
        {isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {trend}
      </div>
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Analytics;
