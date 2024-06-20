export enum TransferType {
  TAKE_COMMISIONS = 'take_commissions',
  RETURN_STRIPE_FEES = 'return_stripe_fees',
  REFFERRER_COMMISION_PAYOUT = 'referrer_commission_payout',
  IREFER_COMMISION_PAYOUT = 'irefer_commission_payout',
  CHARITY_COMMISION_PAYOUT = 'charity_commission_payout',

  // add reversals below
}

export enum TransferStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  PARTIALLY_REFUNDED = 'partially_refunded',
  REFUNDED = 'refunded',
  FORFEITED = 'forfeited',
}
