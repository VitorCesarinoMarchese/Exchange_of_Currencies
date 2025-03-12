export const isPositiveNumber = (value: any) => {
    return isFinite(value) && value > 0 && typeof value == "number";
  };