const Villa = require('../Module/Villa');

const addVilla = async (req, res) => {
    try {
      const { Villaname, price, location, place, guest, bedrooms, area, bathrooms } = req.body;

      // Validate required fields
      if (!Villaname || !price || !location || !place || !guest || !bedrooms || !area || !bathrooms) {
        return res.status(400).json({ message: 'All villa fields are required.' });
      }

      // Check if image was uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded.' });
      }

      // Create a new villa
      const newVilla = new Villa({
        Villaname,
        price,
        location,
        place,
        Imageview: `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`,
        guest,
        bedrooms,
        area,
        bathrooms,
      });

      await newVilla.save();

      res.status(201).json(newVilla);
    } catch (error) {
      console.error('Error adding villa:', error.message);
      res.status(500).json({ message: 'Server error while adding villa.' });
    }
  };

const updateVilla = async (req, res) => {

  
    try {
      const villaId = req.params.id;
      const { Villaname, price, location, place, guest, bedrooms, area, bathrooms } = req.body;

      
      if (!Villaname || !price || !location || !place || !guest || !bedrooms || !area || !bathrooms) {
        return res.status(400).json({ message: 'All villa fields are required.' });
      }


      let villa = await Villa.findById(villaId);
      if (!villa) {
        return res.status(404).json({ message: 'Villa not found.' });
      }
      villa.Villaname = Villaname;
      villa.price = price;
      villa.location = location;
      villa.place = place;
      villa.guest = guest;
      villa.bedrooms = bedrooms;
      villa.area = area;
      villa.bathrooms = bathrooms;


      if (req.file) {
        villa.Imageview = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
      }

      await villa.save();

      res.status(200).json(villa);
    } catch (error) {
      console.error('Error updating villa:', error);
      res.status(500).json({ message: `Error updating villa: ${error.message}` });

    }
  };

const deleteVilla = async (req, res) => {
    try {
      const villaId = req.params.id;

      // Find the villa by ID
      const villa = await Villa.findById(villaId);
      if (!villa) {
        return res.status(404).json({ message: 'Villa not found.' });
      }

      await Villa.findByIdAndDelete(villaId);

      res.status(200).json({ message: `Villa with ID ${villaId} deleted successfully.` });
    } catch (error) {
      console.error('Error deleting villa:', error.message);
      res.status(500).json({ message: 'Server error while deleting villa.' });
    }
  };

const getAllVillas = async (req, res) => {
  try {
    const villas = await Villa.find().sort({ createdAt: -1 });
     res.status(200).json(villas);
  } catch (error) {
    console.error('Error fetching villas:', error.message);
    res.status(500).json({ message: 'Server error while fetching villas.' });
  }
};

// const geAllVillas = async (req, res) => {
//   try {
      

//       const villas = await Villa.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
//       const totalVillas = await Villa.countDocuments(); // Total number of villas

//       res.status(200).json({
//           totalVillas,
//           page,
//           villas,
//       });
//   } catch (error) {
//       console.error('Error fetching villas:', error.message);
//       res.status(500).json({ message: 'Server error while fetching villas.' });
//   }
// };


// Get a single villa by ID
const getVillaById = async (req, res) => {
  try {
    const villaId = req.params.id;
    const villa = await Villa.findById(villaId);
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found.' });
    }
    res.status(200).json(villa);
  } catch (error) {
    console.error('Error fetching villa:', error.message);
    res.status(500).json({ message: 'Server error while fetching villa.' });
  }
};

module.exports = {
    getAllVillas,
    addVilla,
    updateVilla,
    deleteVilla,
    getVillaById
};
