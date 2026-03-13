import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Attribute {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select';
  is_required: boolean;
  is_multiple: boolean;
  options: { id: string; value: string }[];
}

interface AttributeFieldsProps {
  categoryId: string;
  values: any[];
  onChange: (values: any[]) => void;
  errors: any;
}

const AttributeFields: React.FC<AttributeFieldsProps> = ({ categoryId, values, onChange, errors }) => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  useEffect(() => {
    if (!categoryId) {
      setAttributes([]);
      return;
    }
    const fetchAttrs = async () => {
      try {
        const res = await api.get(`/business/categories/${categoryId}/attributes`);
        setAttributes(res.data.data);
      } catch (error) {
        console.error('Özellikler çekilemedi');
      }
    };
    fetchAttrs();
  }, [categoryId]);

  const handleChange = (attrId: string, value: any, type: string, isMultiple: boolean) => {
    const existingIndex = values.findIndex(v => v.attribute_id === attrId);
    const newValues = [...values];
    
    let newValObj: any = { attribute_id: attrId };

    if (type === 'text') newValObj.value_text = value;
    if (type === 'number') newValObj.value_number = value === '' ? null : Number(value);
    
    if (type === 'select') {
      if (isMultiple) {
        // value contains array of option IDs
        newValObj.multi_option_ids = value;
      } else {
        newValObj.value_option_id = value;
      }
    }

    if (existingIndex >= 0) {
      newValues[existingIndex] = newValObj;
    } else {
      newValues.push(newValObj);
    }
    
    onChange(newValues);
  };

  const getValue = (attrId: string) => values.find(v => v.attribute_id === attrId) || {};

  if (!categoryId) return <div className="text-sm text-gray-500 italic">Özellikleri görmek için önce kategori seçin.</div>;
  if (attributes.length === 0) return <div className="text-sm text-gray-500">Bu kategoriye ait özel alan bulunmuyor.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {attributes.map((attr) => {
        const valObj = getValue(attr.id);
        const hasError = errors?.find((e: any) => e.field === `attributes[${attr.id}]`);

        return (
          <div key={attr.id} className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              {attr.name} {attr.is_required && <span className="text-red-500">*</span>}
            </label>
            
            {attr.type === 'text' && (
              <input
                type="text"
                value={valObj.value_text || ''}
                onChange={(e) => handleChange(attr.id, e.target.value, 'text', false)}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
              />
            )}

            {attr.type === 'number' && (
              <input
                type="number"
                value={valObj.value_number ?? ''}
                onChange={(e) => handleChange(attr.id, e.target.value, 'number', false)}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
              />
            )}

            {attr.type === 'select' && !attr.is_multiple && (
              <select
                value={valObj.value_option_id || ''}
                onChange={(e) => handleChange(attr.id, e.target.value, 'select', false)}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${hasError ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Seçiniz...</option>
                {attr.options.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.value}</option>
                ))}
              </select>
            )}

            {attr.type === 'select' && attr.is_multiple && (
              <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50 min-h-[42px]">
                {attr.options.map(opt => {
                  const isChecked = (valObj.multi_option_ids || []).includes(opt.id);
                  return (
                    <label key={opt.id} className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs cursor-pointer transition-colors ${isChecked ? 'bg-orange-100 border-orange-300 text-orange-800' : 'bg-white border-gray-300 text-gray-700'}`}>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentArr = valObj.multi_option_ids || [];
                          const newArr = e.target.checked ? [...currentArr, opt.id] : currentArr.filter((id: string) => id !== opt.id);
                          handleChange(attr.id, newArr, 'select', true);
                        }} 
                      />
                      {opt.value}
                    </label>
                  );
                })}
              </div>
            )}

            {hasError && <p className="text-xs text-red-600">{hasError.message}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default AttributeFields;
