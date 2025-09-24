import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "missing detail" });
        }

        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hasedPassword
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "user does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token, user: { name: user.name } });
        } else {
            return res.json({ success: false, message: 'invalid user' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        res.json({ success: true, credit: user.creditBalance, user: { name: user.name } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {
  try {
    const { planId } = req.body;
    const token = req.headers.token;
    if (!token) return res.json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: "User not found" });

    let credits, plan, amount;
   switch(planId.toLowerCase()) { 
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
    return res.json({ success: false, message: "Please select a valid plan" });
}

    const date = Date.now();
    const newTransaction = await transactionModel.create({ userId, plan, amount, credits, date });

    const options = {
      amount: amount * 100, // in paise
      currency: process.env.CURRENCY || "INR",
      receipt: newTransaction._id.toString(),
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: "Something went wrong" });
      }
      res.json({ success: true, order });
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

 const verifyRazorpay= async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const orderInfo  = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === 'paid')
          {
            const transactionData = await transactionModel.findById(orderInfo.receipt);
           if(transactionData.payment)
            {
              return res.json({ success: false, message: "Transaction already processed" });
            }
            const user = await userModel.findById(transactionData.userId);

            const creditBalance = user.creditBalance + transactionData.credits;
            await userModel.findByIdAndUpdate(user._id, { creditBalance });
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });
             res.json({ success: true, message: "credit added successfully",});
          } else {
            res.json({ success: false, message: "Payment not successful" });
          }
            
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
 }
export { registerUser, loginUser, userCredits, paymentRazorpay ,verifyRazorpay};
