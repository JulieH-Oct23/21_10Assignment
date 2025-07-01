// import Dog from "../models/dogModel.js";

// // Register a dog
// export const registerDog = async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     const newDog = new Dog({
//       name,
//       description,
//       owner: req.user.id,
//     });
//     await newDog.save();
//     res
//       .status(201)
//       .json({ message: "Dog registered successfully", dog: newDog });
//   } catch (error) {
//     console.error("Register Dog Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get user's registered dogs
// export const getRegisteredDogs = async (req, res) => {
//   try {
//     const dogs = await Dog.find({ owner: req.user.id });
//     res.status(200).json({ dogs });
//   } catch (error) {
//     console.error("Get Registered Dogs Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Adopt a dog
// export const adoptDog = async (req, res) => {
//   try {
//     const dog = await Dog.findById(req.params.id);

//     if (!dog) {
//       return res.status(404).json({ message: "Dog not found" });
//     }

//     if (dog.owner.toString() === req.user.id) {
//       return res.status(400).json({ message: "You cannot adopt your own dog" });
//     }

//     if (dog.adoptedBy) {
//       return res.status(400).json({ message: "Dog has already been adopted" });
//     }

//     dog.adoptedBy = req.user.id;
//     dog.thankYouMessage = req.body.thankYou;
//     await dog.save();

//     res.status(200).json({ message: "Dog adopted successfully" });
//   } catch (error) {
//     console.error("Adopt Dog Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Remove a dog
// export const removeDog = async (req, res) => {
//   try {
//     const dog = await Dog.findById(req.params.id);

//     if (!dog) {
//       return res.status(404).json({ message: "Dog not found" });
//     }

//     if (dog.owner.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ message: "You can only remove your own dogs" });
//     }

//     if (dog.adoptedBy) {
//       return res.status(400).json({ message: "Cannot remove an adopted dog" });
//     }

//     await dog.remove();
//     res.status(200).json({ message: "Dog removed successfully" });
//   } catch (error) {
//     console.error("Remove Dog Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

import Dog from "../models/dogModel.js";

// Register a dog
export const registerDog = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newDog = new Dog({
      name,
      description,
      owner: req.user.id,
    });
    await newDog.save();
    res
      .status(201)
      .json({ message: "Dog registered successfully", dog: newDog });
  } catch (error) {
    console.error("Register Dog Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's registered dogs with filtering and pagination
export const getRegisteredDogs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { owner: req.user.id };

    if (status === "adopted") {
      query.adoptedBy = { $ne: null };
    } else if (status === "available") {
      query.adoptedBy = null;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Dog.countDocuments(query);
    const dogs = await Dog.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      dogs,
    });
  } catch (error) {
    console.error("Get Registered Dogs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Adopt a dog
export const adoptDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    if (dog.owner.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot adopt your own dog" });
    }

    if (dog.adoptedBy) {
      return res.status(400).json({ message: "Dog has already been adopted" });
    }

    dog.adoptedBy = req.user.id;
    dog.thankYouMessage = req.body.thankYou;
    await dog.save();

    res.status(200).json({ message: "Dog adopted successfully" });
  } catch (error) {
    console.error("Adopt Dog Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a dog
export const removeDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    if (dog.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only remove your own dogs" });
    }

    if (dog.adoptedBy) {
      return res.status(400).json({ message: "Cannot remove an adopted dog" });
    }

    await dog.remove();
    res.status(200).json({ message: "Dog removed successfully" });
  } catch (error) {
    console.error("Remove Dog Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
