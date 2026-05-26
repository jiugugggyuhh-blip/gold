const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        item: {
            type: String,
            required: true,
        },
        itemType: {
            type: String,
            enum: ["gold", "rial", "coin" ,"crypto"],
            required: true,
        },
        amount: {
            type: Number,
            default: 0,
            required: true,
        },
       

    },
    { timestamps: true }
);

module.exports = mongoose.model("wallet", walletSchema);
