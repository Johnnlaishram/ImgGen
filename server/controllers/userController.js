import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Please enter email and password" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        creditBalance: user.creditBalance,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const userCredits = async (req, res) => {
  try {
    const { id: userId } = req.user; // ✅ because req.user = decoded
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      credit: user.creditBalance,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('User credits error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


const paymentRazorpay = async (req, res) => {
  try {
    const { planId } = req.body;
    const token = req.headers.token;

    if (!token) return res.json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    let credits, plan, amount;

    switch (planId.toLowerCase()) {
      case "basic":
        credits = 100;
        plan = "Basic";
        amount = 10;
        break;
      case "advanced":
        credits = 550;
        plan = "Standard";
        amount = 50;
        break;
      case "business":
        credits = 5000;
        plan = "Business";
        amount = 250;
        break;
      default:
        return res.json({ success: false, message: "Invalid plan" });
    }

    const transaction = await transactionModel.create({
      userId,
      plan,
      amount,
      credits,
      date: Date.now(),
    });

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY || "INR",
      receipt: transaction._id.toString(),
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error("Razorpay order error:", err);
        return res.json({ success: false, message: "Payment failed" });
      }
      res.json({ success: true, order });
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status !== "paid") {
      return res.json({ success: false, message: "Payment not successful" });
    }

    const transaction = await transactionModel.findById(orderInfo.receipt);
    if (!transaction) {
      return res.json({ success: false, message: "Transaction not found" });
    }

    if (transaction.payment) {
      return res.json({ success: false, message: "Transaction already processed" });
    }

    const user = await userModel.findById(transaction.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const updatedCredit = user.creditBalance + transaction.credits;
    await userModel.findByIdAndUpdate(user._id, { creditBalance: updatedCredit });
    await transactionModel.findByIdAndUpdate(transaction._id, { payment: true });

    res.json({
      success: true,
      message: "Credits added successfully",
      creditBalance: updatedCredit,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay };
