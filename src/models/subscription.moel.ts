import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema({
  subscriber: {
    type: Schema.ObjectId,
    ref: "User",// one who is subscribing
  },
  channel: {
    type: Schema.ObjectId,
    ref: "User",// this channel is subscribed
  }
}, {
  timestamps: true
});

const Subscription = model("Subscription", subscriptionSchema);

export default Subscription;