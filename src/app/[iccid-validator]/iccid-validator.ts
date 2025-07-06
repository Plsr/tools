export const validateIccid = (iccid: string) => {
  const length = iccid.length;
  if (length !== 19 && length !== 20) {
    return false;
  }

  const mii = parseInt(iccid.substring(0, 2));
  if (mii !== 89) {
    return false;
  }

  return luhnCheck(iccid);
};

export const luhnCheck = (number: string) => {
  const reverse = number.split("").reverse();
  const givenChecksum = parseInt(reverse.splice(0, 1)[0]);

  let sum = 0;
  reverse.forEach((digit, index) => {
    if (index === 0 || index % 2 === 0) {
      let double = parseInt(digit) * 2;
      if (double > 9) {
        double -= 9;
      }

      sum += double;
      return;
    }

    sum += parseInt(digit);
    return;
  });

  const calculatedChecksum = 9 - ((sum + 9) % 10);

  return givenChecksum === calculatedChecksum;
};
