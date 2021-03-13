const init = () => {
  if (!Array.prototype.hasSameItem) {
    Array.prototype.hasSameItem = function(givenArray) {
      if (!Array.isArray(givenArray)) {
        throw TypeError("Wrong type is given, Array type is expected");
      }
      if (givenArray.length && typeof givenArray[0] !== "string") {
        throw TypeError(
          "Wrong type is given, Array of string type is expected"
        );
      }

      return this.find(item => givenArray.hasItem(item)) !== undefined;
    };
  }

  if (!Array.prototype.hasItem) {
    Array.prototype.hasItem = function(item) {
      if (typeof item !== "string") {
        throw TypeError("Wrong type is given, string type expected");
      }

      return this.find(i => i === item);
    };
  }
};

module.exports = {
  init
};
