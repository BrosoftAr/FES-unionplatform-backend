const bcrypt = require("bcrypt");
const saltRounds = 10;

export const getHashForPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

export const checkPasswordHash = async (password: string, hash: string) => {
  const valid = await bcrypt.compare(password, hash);
  return valid;
};
