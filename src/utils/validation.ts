import { z } from 'zod';

/**
 * Creates a numeric Zod validator that elegantly handles empty inputs (e.g., when a user clears a field).
 * It prevents "Expected number, received nan" validation errors while typing.
 *
 * @param requiredMessage Message to display if the field is required but left empty.
 * @param min Minimum allowed value (default 0).
 */
export const zodNumeric = (requiredMessage: string, min: number = 0): any => {
  return z.preprocess((val: unknown) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const parsed = Number(val);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number({ 
    message: requiredMessage
  }).min(min, `${requiredMessage} (minimum ${min})`));
};

export const zodNumericOptional = (min: number = 0): any => {
  return z.preprocess((val: unknown) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const parsed = Number(val);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number().min(min).optional());
};
