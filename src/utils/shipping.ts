import type { DeliveryMethod, DeliveryRegion, ShippingSettings } from '../types';

export function qualifiesForFreeDelivery(settings: ShippingSettings, subtotal: number, itemCount: number) {
  if (!settings.freeDeliveryEnabled) return false;
  const amountActive = settings.freeDeliveryMinAmount > 0;
  const itemsActive = settings.freeDeliveryMinItems > 0;
  const amountMet = amountActive && subtotal >= settings.freeDeliveryMinAmount;
  const itemsMet = itemsActive && itemCount >= settings.freeDeliveryMinItems;
  return settings.freeDeliveryRequirement === 'BOTH'
    ? (amountActive || itemsActive) && (!amountActive || amountMet) && (!itemsActive || itemsMet)
    : amountMet || itemsMet;
}

export function calculateShippingFee(settings: ShippingSettings, subtotal: number, itemCount: number, region: DeliveryRegion, method: DeliveryMethod) {
  if (qualifiesForFreeDelivery(settings, subtotal, itemCount)) return 0;
  const regionalFee = region === 'dhaka_city'
    ? settings.dhakaCityFee
    : region === 'dhaka_subarea'
      ? settings.dhakaSubAreaFee
      : settings.outsideDhakaFee;
  return regionalFee + (method === 'express' ? settings.expressSurcharge : 0);
}
