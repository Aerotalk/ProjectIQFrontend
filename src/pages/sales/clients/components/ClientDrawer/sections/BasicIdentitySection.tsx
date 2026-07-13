import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../../../../../../components/ui/input';

interface Props {
  readOnly?: boolean;
}

export default function BasicIdentitySection({ readOnly }: Props) {
  const { register, watch, formState: { errors } } = useFormContext();
  const customerType = watch('customerType');

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
        Part A — Basic Identity
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Customer Type *</label>
          <div className="flex gap-4 mt-2">
            <label htmlFor="customer-type-business" className="flex items-center gap-2">
              <input id="customer-type-business" type="radio" value="Business" {...register('customerType')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Business</span>
            </label>
            <label htmlFor="customer-type-individual" className="flex items-center gap-2">
              <input id="customer-type-individual" type="radio" value="Individual" {...register('customerType')} disabled={readOnly} className="text-[#792359] focus:ring-[#792359]" />
              <span className="text-sm text-gray-900 dark:text-gray-200">Individual</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customerType === 'Business' ? (
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Company Name *</label>
              <Input 
                type="text" 
                {...register('companyName')} 
                disabled={readOnly}
                placeholder="e.g. Acme Corp"
                className={`${errors.companyName ? 'border-red-500' : ''}`} 
              />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message as string}</p>}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">First Name *</label>
                <Input 
                  type="text" 
                  {...register('firstName')} 
                  disabled={readOnly}
                  className={`${errors.firstName ? 'border-red-500' : ''}`} 
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message as string}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Last Name</label>
                <Input 
                  type="text" 
                  {...register('lastName')} 
                  disabled={readOnly}
                />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Display Name *</label>
            <Input 
              type="text" 
              {...register('displayName')} 
              disabled={readOnly}
              placeholder="Name shown in all dropdowns and document headers"
              className={`${errors.displayName ? 'border-red-500' : ''}`} 
            />
            <p className="text-xs text-gray-500 mt-1">Must be unique. Max 100 characters.</p>
            {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName.message as string}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
