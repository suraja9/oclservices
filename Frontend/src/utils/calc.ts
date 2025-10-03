// Volumetric Weight Calculation Utilities

export interface VolumetricCalcResult {
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

/**
 * Calculate volumetric weight using standard formula
 * Formula: (Length × Width × Height) / 5000
 */
export function calculateVolumetricWeight(
  length: number,
  width: number, 
  height: number,
  actualWeight: number
): VolumetricCalcResult {
  // Convert dimensions to centimeters if needed
  const volumetricWeight = (length * width * height) / 5000;
  const chargeableWeight = Math.max(actualWeight, volumetricWeight);
  
  return {
    actualWeight,
    volumetricWeight: Math.round(volumetricWeight * 100) / 100,
    chargeableWeight: Math.round(chargeableWeight * 100) / 100,
    dimensions: { length, width, height }
  };
}

/**
 * Calculate shipping rates based on weight, zone, and service type
 */
export function calculateShippingRate(
  weight: number,
  zone: string,
  serviceType: string,
  ratesData: any
) {
  const zoneData = ratesData.zones[zone];
  const serviceData = ratesData.serviceTypes[serviceType];
  
  if (!zoneData || !serviceData) {
    throw new Error('Invalid zone or service type');
  }
  
  // Find weight slab
  const weightSlab = ratesData.weightSlabs.find(
    (slab: any) => weight >= slab.min && weight < slab.max
  );
  
  if (!weightSlab) {
    throw new Error('Weight out of range');
  }
  
  const baseAmount = zoneData.baseRate * weightSlab.multiplier * serviceData.multiplier;
  const fuelSurcharge = baseAmount * zoneData.fuelSurcharge;
  const subtotal = baseAmount + fuelSurcharge;
  const gst = subtotal * ratesData.gstRate;
  const total = subtotal + gst;
  
  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    total: Math.round(total * 100) / 100,
    zone: zoneData.name,
    service: serviceData.name,
    deliveryDays: serviceData.deliveryDays
  };
}