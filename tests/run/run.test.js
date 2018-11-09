require("../common/testsInit").default()
    .then(() => {
        console.log("./mainTests 1");
        require("./mainTests").default();
        console.log("./mainTests 2");
        run();
    });