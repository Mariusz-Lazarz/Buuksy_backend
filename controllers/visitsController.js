const User = require("../models/User");
const Salon = require("../models/Salon");
const jwt = require("jsonwebtoken");
const moment = require("moment");

exports.saveUserVisit = async (req, res) => {
  try {
    const { userEmail, salonId, employeeId, name, price, date } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      {
        $push: { visits: { salonId, employeeId, name, price, date } },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(201)
      .json({ message: "Your visit has been booked successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserVisits = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "your-secret-key");
    const userEmail = decoded.email;

    const user = await User.findOne({ email: userEmail }).select("visits");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const visitsWithSalonData = await Promise.all(
      user.visits.map(async (visit) => {
        const salon = await Salon.findById(visit.salonId).select("image name");
        return {
          ...visit,
          salonImage: salon ? salon.image : null,
          salonName: salon ? salon.name : null,
        };
      })
    );

    res.status(200).json({ visits: visitsWithSalonData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.saveEmployeeVisit = async (req, res) => {
  try {
    const { userEmail, salonId, employeeId, name, price, date } = req.body;

    const updatedSalon = await Salon.findByIdAndUpdate(
      salonId,
      {
        $push: { visits: { userEmail, employeeId, name, price, date } },
      },
      { new: true }
    );

    if (!updatedSalon) {
      return res.status(404).json({ message: "Salon not found." });
    }

    res
      .status(201)
      .json({ message: "Your visit has been booked successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.checkEmployeeAvailability = async (req, res) => {
  try {
    const { date: requestDate, salonId, employeeId } = req.body;

    const parsedRequestDate = moment(requestDate).startOf("day");

    const salon = await Salon.findById(salonId);

    if (!salon) {
      return res.status(404).json({ message: "Salon not found." });
    }

    const bookedSlots = salon.visits
      .filter((visit) => {
        const visitDate = moment(visit.date);
        return (
          visit.employeeId === employeeId &&
          visitDate.isSame(parsedRequestDate, "day")
        );
      })
      .map((visit) => moment(visit.date).format("HH:mm"));

    res.json({ bookedSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
