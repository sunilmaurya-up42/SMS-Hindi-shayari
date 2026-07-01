import { v4 as uuid } from "uuid";

const generateRefreshToken = () => {
  return uuid();
};

export default generateRefreshToken;
