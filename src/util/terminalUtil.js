export const initStripeTerminal = (cb) => {
  window['initStripeTerminal'](cb)
  //window.initStripeTerminal();
};

export const sendTerminalPayment = (amount) => {
  window['sendTerminalPayment'](amount);
};

export const addPaymentDoneListener = (done) => {
  window['addPaymentDoneListener'](done);
}