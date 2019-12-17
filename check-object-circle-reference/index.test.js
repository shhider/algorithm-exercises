const checkCircleRef = require("./index");

test("check whether object has circle reference", () => {
  let obj = { a: 123, b: null, c: { d: 456 } };
  expect(checkCircleRef(obj)).toBe(false);

  let cc = {};
  obj.c.d = cc;
  obj.c.e = cc;
  expect(checkCircleRef(obj)).toBe(false);

  obj.c.f = obj;
  expect(checkCircleRef(obj)).toBe(true);
});
