export const DISCRETE_UNITS = [
  'Box',
  'Boxes',
  'Piece',
  'Pieces',
  'Carton',
  'Packet',
  'Pair',
  'Set',
  'Roll',
  'Bundle',
  'Bag',
  'Bottle',
  'Can',
  'Unit'
];

export const isDiscreteUnit = (unit: string | undefined | null): boolean => {
  if (!unit) return false;
  return DISCRETE_UNITS.map(u => u.toLowerCase()).includes(unit.toLowerCase());
};

export const getQuantityInputConfig = (unit: string | undefined | null) => {
  const isDiscrete = isDiscreteUnit(unit);
  return {
    step: isDiscrete ? "1" : "0.01",
    min: isDiscrete ? "1" : "0.01",
    isDiscrete,
  };
};

export const validateQuantity = (quantity: number, unit: string | undefined | null): string | true => {
  if (isDiscreteUnit(unit)) {
    if (!Number.isInteger(quantity)) {
      return `${unit || 'This unit'} can only have whole number quantities.`;
    }
  }
  if (quantity <= 0) {
    return 'Quantity must be greater than 0.';
  }
  return true;
};
