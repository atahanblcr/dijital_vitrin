import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, MessageCircle, Package, FileText, TrendingUp, RefreshCcw } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'sonner';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const [analyticsRes, productsRes] = await Promise.all([
        api.get('/analytics/business?days=30'),
        api.get('/business/products')
      ]);
      
      setStats({
        analytics: analyticsRes.data.totals,
        productCount: productsRes.data.data.length,
        topProducts: [] // Gelecekte eklenebilir
      });
    } catch (error) {
      toast.error('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCcw className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hoş Geldiniz 👋</h2>
          <p className="text-gray-500 text-sm">İşletmenizin bugün neler yaptığına bir göz atın.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStat 
          title="Toplam Ürün" 
          value={stats.productCount} 
          icon={<ShoppingBag className="w-6 h-6 text-orange-600" />} 
          bgColor="bg-orange-50" 
        />
        <QuickStat 
          title="Aylık Görüntülenme" 
          value={stats.analytics.pageViews} 
          icon={<Eye className="w-6 h-6 text-blue-600" />} 
          bgColor="bg-blue-50" 
        />
        <QuickStat 
          title="Aylık WA Tıklaması" 
          value={stats.analytics.whatsappClicks} 
          icon={<MessageCircle className="w-6 h-6 text-green-600" />} 
          bgColor="bg-green-50" 
        />
        <QuickStat 
          title="Dönüşüm Oranı" 
          value={`%${stats.analytics.pageViews > 0 ? ((stats.analytics.whatsappClicks / stats.analytics.pageViews) * 100).toFixed(1) : '0'}`} 
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />} 
          bgColor="bg-purple-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Hızlı İşlemler</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionCard 
              title="Yeni Ürün Ekle" 
              desc="Vitrine hemen yeni bir ürün yerleştirin."
              icon={<Package className="w-5 h-5 text-blue-600" />}
              link="/products"
            />
            <ActionCard 
              title="Blog Yazısı Yaz" 
              desc="Müşterilerinizi yeni gelişmelerden haberdar edin."
              icon={<FileText className="w-5 h-5 text-green-600" />}
              link="/blog"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 text-center">İşletme Durumu</h3>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center">
              <span className="text-green-600 font-bold">AKTİF</span>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Dijital vitrininiz yayında ve müşterileriniz tarafından erişilebilir durumda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickStat = ({ title, value, icon, bgColor }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <h3 className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const ActionCard = ({ title, desc, icon, link }: any) => (
  <a 
    href={link}
    className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all group"
  >
    <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
  </a>
);

export default Dashboard;
