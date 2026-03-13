import React from 'react';

interface Attribute {
  name: string;
  value: string;
}

interface AttributeTableProps {
  attributes: Attribute[];
}

export default function AttributeTable({ attributes }: AttributeTableProps) {
  if (!attributes || attributes.length === 0) return null;

  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl">
      <table className="w-full text-sm text-left">
        <tbody>
          {attributes.map((attr, index) => (
            <tr 
              key={index} 
              className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-100 w-1/3">
                {attr.name}
              </td>
              <td className="px-4 py-3 text-gray-700">
                {attr.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
