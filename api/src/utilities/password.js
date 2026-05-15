
const bcrypt = require("bcrypt");


const generateHash = async (plainText) => {
  try {
    // Edge case: Agar password/otp khali hai toh error throw karo
    if (!plainText) {
      throw new Error("Input text is required for hashing");
    }

    const saltRounds = 10; // Industry standard for security vs performance

    // Salt generate karna aur hash karna ek sath (Recommended)
    const hashedValue = await bcrypt.hash(`${plainText}`, saltRounds);

    return hashedValue;
  } catch (error) {
    console.error("Error in generateHash utility:", error.message);
    throw error; // Controller ko error pass karna zaroori hai
  }
};

const compareHash = async (plainText, hashedValue) => {
  try {
    // Edge case: Input validation
    if (!plainText || !hashedValue) {
      throw new Error("Both plain text and hash are required for comparison");
    }

    // bcrypt.compare khud hi salt rounds aur hash pattern check kar leta hai
    const isMatch = await bcrypt.compare(`${plainText}`, hashedValue);

    return isMatch;
  } catch (error) {
    console.error("Error in compareHash utility:", error.message);
    // Security Best Practice: Comparison fail hone par hamesha false return karein 
    // taaki attacker ko exact error na mile
    return false; 
  }
};

module.exports = { generateHash, compareHash };