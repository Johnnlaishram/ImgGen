import userModel from "../models/userModel.js"
import FormData from "form-data"
import axios from "axios"

const generateImage = async (req, res) => {
  try {
    const { prompt, userId } = req.body
    const user = await userModel.findById(userId)

    if (!user || !prompt) {
      return res.json({ success: false, message: "User or prompt not found" })
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "Insufficient credit balance",
        creditBalance: user.creditBalance,
      })
    }

    const formData = new FormData()
    formData.append("prompt", prompt)

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    )

    const base64Image = Buffer.from(data, "binary").toString("base64")
    const resultImage = `data:image/png;base64,${base64Image}`

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    })

    res.json({
      success: true,
      image: resultImage,
      creditBalance: user.creditBalance - 1,
    })
  } catch (error) {
    console.error("Image generation error:", error.response?.data || error.message)
    res.status(500).json({
      success: false,
      message: "Something went wrong while generating the image",
      error: error.response?.data || error.message,
    })
  }
}

export default generateImage
