import React from 'react';
import { Search, MapPin, Globe, Phone, Clock, CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';

const GoogleGuide = () => {
  const steps = [
    {
      title: "Google İşletme Profiline Gidin",
      desc: "İşletmenizi Google Haritalar ve Arama'da ücretsiz olarak listelemek için ilk adımı atın.",
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      link: "https://business.google.com",
      action: "Siteye Git"
    },
    {
      title: "İşletme Bilgilerinizi Girin",
      desc: "İşletme adınızı, kategorinizi ve varsa fiziksel mağaza adresinizi doğru şekilde tanımlayın.",
      icon: <MapPin className="w-6 h-6 text-red-600" />,
    },
    {
      title: "Dijital Vitrin Adresinizi Ekleyin",
      desc: "Web sitesi kısmına size özel oluşturduğumuz 'isletme.dijitalvitrin.com' adresinizi yazın.",
      icon: <Search className="w-6 h-6 text-orange-600" />,
    },
    {
      title: "İletişim Bilgileri ve Saatler",
      desc: "WhatsApp numaranızı ve çalışma saatlerinizi ekleyerek müşterilerin size ulaşmasını kolaylaştırın.",
      icon: <Phone className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Doğrulama Yapın",
      desc: "Google'ın sunduğu yöntemlerle (Posta, Telefon veya E-posta) işletmenizi doğrulayın.",
      icon: <CheckCircle2 className="w-6 h-6 text-blue-500" />,
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl mb-2">
          <Search className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Google'da Görünün 🔍</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          İşletmenizi Google Haritalar'a ekleyerek daha fazla müşteriye ulaşın ve dijital vitrininizle güven verin.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center group">
            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
              {step.icon}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">
                  {index + 1}
                </span>
                <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>

            {step.link && (
              <a 
                href={step.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                {step.action}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-bold text-orange-900">Neden Google Haritalar?</h3>
          <ul className="space-y-3">
            {[
              "Yerel aramalarda en üstte çıkarsınız.",
              "Müşterileriniz yol tarifi alabilir.",
              "İşletmeniz daha profesyonel görünür.",
              "Dijital Vitrin linkinizle ürünlerinizi sergilersiniz."
            ].map((item, i) => (
              <li key={i} className="flex items-center text-sm text-orange-800 font-medium">
                <CheckCircle2 className="w-4 h-4 mr-3 text-orange-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-auto">
          <button className="w-full md:w-auto px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 flex items-center justify-center">
            Hemen Başlayın
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleGuide;
