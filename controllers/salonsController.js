const Salon = require("../models/Salon");

exports.getAllSalons = async (req, res) => {
  try {
    const category = req.query.category;

    const query = category ? { category } : {};

    const salons = await Salon.find(query);

    res.status(200).json(salons);
  } catch (error) {
    console.error("Error retrieving salons:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSalonById = async (req, res) => {
  try {
    const id = req.params.id;
    const salon = await Salon.findById(id);

    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    res.status(200).json(salon);
  } catch (error) {
    console.error("Error retrieving salon by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
