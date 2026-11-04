import React from 'react';

export default function InputField({ label, type = 'text', placeholder, value, onChange }) {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-1.5">
      <label className="text-slate-900 text-xs font-medium font-['Inter']">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3.5 py-3 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 text-slate-900 placeholder:text-slate-400 text-sm font-normal font-['Inter'] focus:outline-2 focus:outline-teal-700 focus:outline-offset-[-2px] transition-all"
      />
    </div>
  );
}