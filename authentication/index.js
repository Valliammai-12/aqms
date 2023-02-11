const crypto = require("crypto");
const jwt = require("jsonwebtoken");

class Auth {
  constructor() {
    this.jwt = require("jsonwebtoken");
  }
  configAuth({ salt, secret, expiresIn }) {
    this.salt = salt;
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  configMailServer({ host, port, secure, user, pass }) {
    this.transporter = require("nodemailer").createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  sendMail({from, to, subject, htmlToSend}) {
    const transporter = this.transporter;
    if (!transporter) {
      throw new Error("Mail server not configured");
    }

    transporter.sendMail({from, to, subject, htmlToSend}, function (error, info) {
      if (error) {
        console.log(error);
        return error;
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }

  generateToken(userID, userType) {
    const payload = {
      userID,
      userType,
    };
    const options = {
      expiresIn: this.expiresIn,
    };
    return this.jwt.sign(payload, this.secret, options);
  }

  verifyToken(token) {
    if (!this.secret) {
      throw new Error("Secret key not provided");
    }
    return this.jwt.verify(token, this.secret);
  }

  static generateSalt() {
    return crypto.randomBytes(16).toString("hex");
  }

  static generateSecretKey() {
    return crypto.randomBytes(64).toString("hex");
  }

  static generateOTP(digit) {
    var digits = "1234567890";
    var otp = "";
    for (var i = 0; i < digit; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  generateHash(password) {
    return crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`);
  }

  isValidPassword(password, hash) {
    return this.generateHash(password) === hash;
  }

  checkUserType(userType) {
    return (req, res, next) => {
      if (req.decoded.userID.userType !== userType) {
        res.status(401).json({
          message: "You are not authorized to access this resource",
        });
        return;
      }
      next();
    };
  }
}

checkAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ message: "Authentication header missing" });
    return;
  }

  const token = header.split("Bearer ")[1];

  if (!token) {
    res.status(401).json({ message: "Authentication token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(auth.verifyToken(token));
    req.decoded = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Failed to authenticate token",
    });
  }
}

exports.auth = new Auth();
exports.checkAuth = checkAuth;