module.exports = {
  routes: [
    {
      method: "POST",
      path: "/payments/initiate",
      handler: "payment.initiatePayment",
    },
    {
      method: "POST",
      path: "/payments/status",
      handler: "payment.paymentStatus",
    },
  ],
};
