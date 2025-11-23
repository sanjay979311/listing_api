import Area from '../models/AreaModel.js';
import State from '../models/stateModel.js';
import City from '../models/cityModel.js';



export const createArea = async (req, res) => {
  try {
    const { areas } = req.body;

    if (!Array.isArray(areas) || areas.length === 0)
      return res.status(400).json({ message: "Please provide at least one area." });

    const createdAreas = [];

    for (const { name, country, state, city } of areas) {
      if (!name || !country || !state || !city)
        throw new Error(`Missing required fields for area "${name || "unknown"}".`);

      const existing = await Area.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        city,
      });

      if (existing)
        throw new Error(`Area "${name}" already exists in this city.`);

      const newArea = await Area.create({ name, country, state, city });
      createdAreas.push(newArea);
    }

    return res.status(201).json({
      message: `${createdAreas.length} area(s) added successfully.`,
      data: createdAreas,
    });
  } catch (error) {
    console.error("❌ Error creating area:", error.message);

    let message = "Something went wrong.";
    if (error.message.includes("already exists")) message = error.message;
    else if (error.message.includes("Missing required")) message = error.message;
    else if (error.name === "ValidationError") message = "Invalid data format.";
    else if (error.name === "CastError") message = "Invalid city/state/country ID.";
    else if (error.code === 11000) message = "Duplicate key error.";

    return res.status(400).json({ message });
  }
};






// ✅ Get all cities (Admin & Customers)
export const getAllArea = async (req, res) => {
    try {
        const cities = await Area.find().populate('state country city', 'name').sort({ createdAt: -1 });;
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get a single Area by ID (Admin & Customers)
export const getSingleArea = async (req, res) => {
   
    try {
        const area = await Area.findById(req.params.id)
            .populate("country", "name")
            .populate("state", "name")
            .populate("city", "name");

        if (!area) {
            return res.status(404).json({ message: "Area not found" });
        }

        return res.json(area);
    } catch (error) {
        console.error("Get Single Area Error:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};


export const getCitiesByState = async (req, res) => {
    try {
        console.log("Fetching cities for state ID:", req.params.stateId);

        // Find cities based on state ID
        const cities = await Area.find({ state: req.params.stateId })
            .populate('state country', 'name')
            .exec();

        // Always return an array, even if empty
        res.status(200).json(cities.length ? cities : []);
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const getCitiesByCountry = async (req, res) => {
    try {
        const countryId = req.params.id;
        console.log("Fetching cities for country ID:", countryId);

        // Find cities based on country ID
        const cities = await Area.find({ country: countryId })
            .populate('state country', 'name') // assuming you want to include state & country names
            .exec();

        res.status(200).json(cities); // returns empty array if none found, so no need to check length
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const getAreaByStateId = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetching cities for state ID:", id);

        // Find cities based on the given state ID
        const AreaList = await Area.find({ state: req.params.id });

        // If no cities exist, return an empty array (not an error)
        if (!AreaList.length) {
            return res.status(200).json([]); // Returning [] instead of 404
        }

        // Return the list of cities
        res.status(200).json(AreaList);

    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ message: 'Server error', error });
    }
}



// ✅ Update a Area (Only Admin)
// export const updateArea = async (req, res) => {
//     try {
//         const { name,country , state,city } = req.body;
       
//         const updateArea = await Area.findByIdAndUpdate(req.params.id, { name, country,state,city  }, { new: true });

//         if (!updateArea) return res.status(404).json({ message: "Area not found" });

//         res.json({ message: "Area updated successfully", updateArea });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };

export const updateArea = async (req, res) => {
    try {
        const { name, country, state, city } = req.body;

        const updatedArea = await Area.findByIdAndUpdate(
            req.params.id,
            { name, country, state, city },
            { new: true }
        );

        if (!updatedArea) {
            return res.status(404).json({ message: "Area not found" });
        }

        res.json({
            message: "Area updated successfully",
            area: updatedArea
        });
    } catch (error) {
        console.error("Update Area Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const deleteArea = async (req, res) => {
    try {
        console.log("area id ============>", req.params.id);

        const deletedArea = await Area.findByIdAndDelete(req.params.id);

        if (!deletedArea) {
            return res.status(404).json({ message: "Area not found" });
        }

        return res.json({ message: "Area deleted successfully" });
    } catch (error) {
        console.error("Delete Area Error:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};