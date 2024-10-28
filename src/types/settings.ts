// src/types/settings.ts
export interface StoreSettings {
  storeName: string;
  currency: string;
  timezone: string;
  orderPrefix: string;
  storeEmail?: string;
  phoneNumber?: string;
}

export interface ShippingSettings {
  freeShippingThreshold: string;
  defaultShippingRate: string;
  internationalShipping: boolean;
  localPickup: boolean;
}

export interface NotificationSettings {
  orderConfirmation: boolean;
  orderShipped: boolean;
  orderDelivered: boolean;
  lowStock: boolean;
  newCustomer: boolean;
  newsletter: boolean;
}
