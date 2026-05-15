const multer = require("multer");


// Isme destination ya filename ki tension nahi hoti
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Sirf images allow karne ke liye
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Please attach only image files!"), false);
  }
};

module.exports.upload = multer({
  storage: storage,
  // limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter,
});