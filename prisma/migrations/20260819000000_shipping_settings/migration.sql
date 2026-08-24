CREATE TABLE "ShippingSettings" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "dhakaCityFee" DECIMAL(10,2) NOT NULL DEFAULT 60,
  "dhakaSubAreaFee" DECIMAL(10,2) NOT NULL DEFAULT 80,
  "outsideDhakaFee" DECIMAL(10,2) NOT NULL DEFAULT 120,
  "expressSurcharge" DECIMAL(10,2) NOT NULL DEFAULT 130,
  "freeDeliveryEnabled" BOOLEAN NOT NULL DEFAULT true,
  "freeDeliveryMinAmount" DECIMAL(12,2) NOT NULL DEFAULT 5000,
  "freeDeliveryMinItems" INTEGER NOT NULL DEFAULT 3,
  "freeDeliveryRequirement" TEXT NOT NULL DEFAULT 'EITHER',
  "taxRate" DECIMAL(5,4) NOT NULL DEFAULT 0.05,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ShippingSettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "ShippingSettings" ("id") VALUES ('default') ON CONFLICT DO NOTHING;
