export default async function() {
  console.info("Teardown mongod");
  await global.__MONGOD__.stop();
}
