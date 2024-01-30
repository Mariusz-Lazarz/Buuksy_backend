const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: String,
  category: String,
  image: String,
  services: Array,
  employees: Array,
  rating: Number,
  ratings: Number,
  visits: Array,
});

module.exports = mongoose.model("Salon", salonSchema, "salons");
