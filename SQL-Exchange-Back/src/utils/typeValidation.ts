export const isPositiveNumber = (value: number) => {
    return isFinite(value) && value > 0 && typeof value == "number";
  };