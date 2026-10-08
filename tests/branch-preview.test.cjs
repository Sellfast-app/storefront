const { test } = require("node:test");
const assert = require("node:assert/strict");
const ts = require("typescript");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const file = path.resolve(__dirname, "../lib/branch-preview.ts");
const retail = Array.from({ length: 5 }, (_, id) => ({ id, product_price: 1000, variants: JSON.stringify([{ price: "1000" }]) }));
const food = [0, 1].map(id => ({ id, portion: [{ price: 1000 }], servingTypePricing: [{ price: 1000 }] }));
const loaded = new Module(file);
loaded.require = () => ({
  isMockFoodStorefront: id => id === "mock-food", isMockRetailStorefront: id => id === "mock-retail",
  mockRetailProducts: retail, mockStorefrontFoodItems: food,
});
loaded._compile(ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, file);
const { resolveBranch, supportsBranches, retailBranchProducts, foodBranchProducts } = loaded.exports;
test("branch link precedes remembered selection then default", () => {
  assert.equal(resolveBranch("main", "lagos"), "main");
  assert.equal(resolveBranch(null, "lagos"), "lagos");
  assert.equal(resolveBranch("unknown", "unknown"), "main");
});
test("live stores and ticketing are excluded", () => {
  assert.equal(supportsBranches("live-store"), false);
  assert.equal(supportsBranches("mockevent"), false);
  assert.equal(supportsBranches("mock-food"), true);
});
test("retail branch overrides and availability do not mutate base data", () => {
  assert.equal(retailBranchProducts("main").length, 5);
  assert.equal(retailBranchProducts("lagos").length, 4);
  assert.equal(retailBranchProducts("lagos")[0].product_price, 20000);
  assert.equal(retail[0].product_price, 1000);
  assert.equal(JSON.parse(retailBranchProducts("lagos")[0].variants)[0].price, "2500");
});
test("food branch prices apply to portions and serving options without compounding", () => {
  assert.equal(foodBranchProducts("lagos").length, 1);
  assert.equal(foodBranchProducts("lagos")[0].portion[0].price, 1300);
  assert.equal(foodBranchProducts("lagos")[0].servingTypePricing[0].price, 1300);
  assert.equal(foodBranchProducts("lagos")[0].portion[0].price, 1300);
  assert.equal(food[0].portion[0].price, 1000);
});
