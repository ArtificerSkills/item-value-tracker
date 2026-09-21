CREATE TABLE "Item" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT,
  "purchaseDate" TIMESTAMP(3) NOT NULL,
  "purchasePrice" DECIMAL(12,2) NOT NULL,
  "additionalCosts" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "currentValue" DECIMAL(12,2),
  "depreciationModel" TEXT NOT NULL DEFAULT 'market',
  "annualRate" DECIMAL(6,4),
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'owned',
  "salePrice" DECIMAL(12,2),
  "saleDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);