export type ShippingRuleValues = {
  dhakaCityFee: unknown;
  dhakaSubAreaFee: unknown;
  outsideDhakaFee: unknown;
  expressSurcharge: unknown;
  freeDeliveryEnabled: boolean;
  freeDeliveryMinAmount: unknown;
  freeDeliveryMinItems: number;
  freeDeliveryRequirement: string;
  taxRate: unknown;
};

export function shippingSettingsDto(settings: ShippingRuleValues) {
  return {
    dhakaCityFee: Number(settings.dhakaCityFee),
    dhakaSubAreaFee: Number(settings.dhakaSubAreaFee),
    outsideDhakaFee: Number(settings.outsideDhakaFee),
    expressSurcharge: Number(settings.expressSurcharge),
    freeDeliveryEnabled: settings.freeDeliveryEnabled,
    freeDeliveryMinAmount: Number(settings.freeDeliveryMinAmount),
    freeDeliveryMinItems: settings.freeDeliveryMinItems,
    freeDeliveryRequirement: settings.freeDeliveryRequirement as 'EITHER' | 'BOTH',
    taxRate: Number(settings.taxRate),
  };
}

export function calculateShipping(
  settings: ShippingRuleValues,
  subtotal: number,
  itemCount: number,
  region: 'dhaka_city' | 'dhaka_subarea' | 'outside_dhaka',
  method: 'standard' | 'express',
) {
  const minAmount = Number(settings.freeDeliveryMinAmount);
  const minItems = settings.freeDeliveryMinItems;
  const amountActive = minAmount > 0;
  const itemsActive = minItems > 0;
  const amountMet = amountActive && subtotal >= minAmount;
  const itemsMet = itemsActive && itemCount >= minItems;
  const thresholdMet = settings.freeDeliveryRequirement === 'BOTH'
    ? (amountActive || itemsActive) && (!amountActive || amountMet) && (!itemsActive || itemsMet)
    : amountMet || itemsMet;

  if (settings.freeDeliveryEnabled && thresholdMet) return 0;

  const regionalFee = region === 'dhaka_city'
    ? Number(settings.dhakaCityFee)
    : region === 'dhaka_subarea'
      ? Number(settings.dhakaSubAreaFee)
      : Number(settings.outsideDhakaFee);
  return regionalFee + (method === 'express' ? Number(settings.expressSurcharge) : 0);
}
