import { formStyles } from './form-styles';

export default function CustomInput({ label, type = 'text', value, onChange, placeholder, className, disabled, required, readOnly }: any) {
  return (
    <div className={`space-y-1 ${className || ''}`}>
      {label && <label className={formStyles.label}>{label} {required && <span className="text-red-500">*</span>}</label>}
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        disabled={disabled || readOnly}
        className={formStyles.field(false, disabled || readOnly)}
      />
    </div>
  );
}
