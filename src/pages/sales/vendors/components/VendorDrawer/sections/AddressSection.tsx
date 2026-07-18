"use no memo";
import SharedAddressSection from '@/components/shared/SharedAddressSection';
import { useFormContext } from 'react-hook-form';

interface Props {
  readOnly?: boolean;
}

export default function AddressSection({ readOnly }: Props) {
  const { watch } = useFormContext();
  const treatment = watch('gstTreatment');
  
  return (
    <SharedAddressSection 
      readOnly={readOnly} 
      treatment={treatment} 
    />
  );
}

