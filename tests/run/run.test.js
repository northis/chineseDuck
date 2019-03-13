require("../common/testsInit")
  .default()
  .then(() => {
    require("./mainTests").default();
    run();
  });
