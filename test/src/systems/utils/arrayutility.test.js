const { init, ArrayObject } = require("@/src/systems/utils/arrayutility");
const { default: expectCt } = require("helmet/dist/middlewares/expect-ct");

describe("array util", () => {
  test("Array prototype polyfill", () => {
    init();

    const arrayOne = ["ab", "bc", "cd", "de"];
    expect(arrayOne.hasItem("ab")).toBeTruthy();
    expect(arrayOne.hasItem("AB")).toBeFalsy();
    expect(arrayOne.hasItem("ef")).toBeFalsy();

    const arrayTwo = ["bc", "ef", "fg", "gh"];
    const arrayThree = [];

    expect(arrayOne.hasSameItem(arrayTwo)).toBeTruthy();
    expect(arrayTwo.hasSameItem(arrayOne)).toBeTruthy();

    expect(arrayOne.hasSameItem(arrayThree)).toBeFalsy();
    expect(arrayThree.hasSameItem(arrayOne)).toBeFalsy();

    expect(() => {
      arrayOne.hasSameItem({});
    }).toThrow(TypeError);

    expect(() => {
      arrayOne.hasSameItem([1, 2, 3]);
    }).toThrow(TypeError);

    expect(() => {
      arrayOne.hasItem(1);
    }).toThrow(TypeError);
  });
});
