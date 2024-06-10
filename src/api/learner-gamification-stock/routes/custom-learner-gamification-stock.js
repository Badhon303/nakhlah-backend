module.exports = {
  routes: [
    {
      method: "GET",
      path: "/learner-gamification-stocks/getInjaz",
      handler: "learner-gamification-stock.findInjaz",
    },
    {
      method: "GET",
      path: "/learner-gamification-stocks/getUserPositionByInjaz",
      handler: "learner-gamification-stock.userPositionByInjaz",
    },
  ],
};
