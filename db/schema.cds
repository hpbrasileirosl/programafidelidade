namespace programadefidelidade;
using { cuid, managed } from '@sap/cds/common';

@assert.unique: { customerNumber: [customerNumber] }
entity Customers : cuid, managed {
  name: String(100);
  email: String(100);
  customerNumber: Integer @mandatory;
  totalPurchaseValue: Integer;
  totalRewardPoints: Integer;
  purchases: Association to many Purchases on purchases.customer = $self;
  redemptions: Association to many Redemptions on redemptions.customer = $self;
}

@assert.unique: { name: [name] }
entity Products : cuid, managed {
  name: String(100) @mandatory;
  description: String(500);
  price: Integer;
  purchases: Association to many Purchases on purchases.selectedProduct = $self;
}

entity Purchases : cuid, managed {
  purchaseValue: Integer;
  rewardPoints: Integer;
  customer: Association to Customers;
  selectedProduct: Association to Products;
}

entity Redemptions : cuid, managed {
  redeemedAmount: Integer;
  customer: Association to Customers;
}

