
import { Input } from './input';

export default function CustomInput({ label, type = 'text', value, onChange, placeholder, className }: any) {
  return (
    <div className={`space-y-1 ${className || ''}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full" />
    </div>
  );
}
