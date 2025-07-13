import Dog from "../models/Dogs.js";

export const registerDog = async (req, res) => {
  console.log("registerDog called, req.body:", req.body);
  console.log("req.user:", req.user);
  try {
    const { name, description } = req.body;
    const registeredBy = req.user._id || req.user.id;

    const newDog = new Dog({
      name,
      description,
      registeredBy,
      registrationStatus: "Available",
      // adoptedBy left as null by default
    });

    console.log("Registering dog:", {
      name,
      description,
      registeredBy,
      registrationStatus: "Available",
      adoptedBy: null,
    });

    await newDog.save();

    res.status(201).json({ message: "Dog registered", dog: newDog });
  } catch (error) {
    console.error("Register Dog Error:", error);
    res.status(500).json({ message: "Failed to register dog", error: error.message });
  }
};

// Get all dogs registered by the currently logged-in user
export const getRegisteredDogs = async (req, res) => {
  const { page = 1, limit = 5, status } = req.query;
  const skip = (page - 1) * limit;

  const query = {
    registeredBy: req.user.id, // filters dogs by current logged-in user
  };

  if (status) query.registrationStatus = status;

  try {
    const dogs = await Dog.find(query).skip(skip).limit(Number(limit));
    const total = await Dog.countDocuments(query);
    res.json({ dogs, total });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch registered dogs", error: error.message });
  }
};

export const getAdoptedDogs = async (req, res) => {
  try {
    // Fetch dogs adopted by current user
    const dogs = await Dog.find({ adoptedBy: req.user._id }).exec();
    res.json({ dogs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch adopted dogs", error: error.message });
  }
};

export const getAvailableDogs = async (req, res) => {
  try {
    // Dogs that are "Available" (not adopted) and NOT registered by current user
    const dogs = await Dog.find({
      registrationStatus: "Available",
      adoptedBy: null,
      registeredBy: { $ne: req.user._id },
    }).exec();
    res.json({ dogs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch available dogs", error: error.message });
  }
};

export const adoptDog = async (req, res) => {
  try {
    const dogId = req.params.id;
    const userId = req.user._id || req.user.id;

    console.log("Adopt attempt:", { dogId, userId });

    if (!dogId || !userId) {
      return res.status(400).json({ message: "Missing dogId or userId" });
    }

    const dog = await Dog.findById(dogId);

    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    // Prevent adopting own dog or a dog already adopted
    if (dog.adoptedBy) {
      return res.status(400).json({ message: "Dog has already been adopted" });
    }

    if (
      dog.registeredBy &&
      dog.registeredBy.toString() === userId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You cannot adopt a dog you registered" });
    }

    // Perform adoption
    dog.adoptedBy = userId;
    dog.registrationStatus = "Adopted";
    await dog.save();

    res.status(200).json({ message: "Dog adopted", dog });
  } catch (error) {
    console.error("Adopt Dog Error:", error.message);
    res.status(500).json({ message: "Failed to adopt dog", error: error.message });
  }
};


export const removeDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    // Only the user who registered OR adopted the dog can remove it
    const userId = req.user._id; // Make sure req.user._id is set by authMiddleware

    if (!dog.registeredBy.equals(userId) && !(dog.adoptedBy && dog.adoptedBy.equals(userId))) {
      return res.status(403).json({ message: "Not authorized to delete this dog" });
    }

    await dog.deleteOne();

    res.json({ message: "Dog removed" });
  } catch (error) {
    console.error("Remove Dog Error:", error.message);
    res.status(500).json({ message: "Failed to remove dog", error: error.message });
  }
};