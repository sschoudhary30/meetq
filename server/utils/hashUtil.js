const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Encrypt the data
const encryptdata = (data) => {
    return CryptoJS.SHA256(data).toString();
};

const bcrypt_password_generate = async(plaintextPassword) => {
        // Generate a salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash the password
        const hashedPassword = await bcrypt.hash(plaintextPassword, salt);
        return hashedPassword;
}

const bcrypt_password_verify = async(enteredPassword, hashedPassword) => {
    const match = await bcrypt.compare(enteredPassword, hashedPassword);
        if (match) {
            return true;
        } else {
            return false;
        }
}


// Export the functions
module.exports = {
  encryptdata,
  bcrypt_password_generate,
  bcrypt_password_verify
};