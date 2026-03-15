import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "Bu vitrine henüz ürün eklenmemiş", 
  description = "Daha sonra tekrar kontrol edin.",
  icon = <PackageOpen className="w-16 h-16 text-gray-300" strokeWidth={1.5} />
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200/60">
      <div className="mb-4 p-4 bg-white rounded-full shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 font-medium max-w-md">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
