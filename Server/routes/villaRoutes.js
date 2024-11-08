const express = require('express');
const router = express.Router();
const { getAllVillas, addVilla, updateVilla, deleteVilla, getVillaById } = require('../Controller/villaController');
const path = require('path'); 
const fs = require('fs');  
const multer = require('multer');
const Villa = require('../Module/Villa'); // Update the path if necessary



const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});


function checkFileType(file, cb) {
 
  const filetypes = /jpeg|jpg|png|gif/;
 
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
 
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

// GET all villas
router.get('/', getAllVillas);

// POST a new villa (admin only) - Only one POST route
router.post('/', upload.single('Imageview'), addVilla);

// PUT to update a villa's information (admin only)
router.put('/:id', upload.single('Imageview'), updateVilla);
// router.put('/:id', upload.single('Imageview'), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const villaData = {
//       Villaname: req.body.Villaname,
//       price: req.body.price,
//       location: req.body.location,
//       place: req.body.place,
//       guest: req.body.guest,
//       bedrooms: req.body.bedrooms,
//       area: req.body.area,
//       bathrooms: req.body.bathrooms,
//       // If image is uploaded, include it in the update
//       Imageview: req.file ? req.file.path : undefined,
//     };

//     // Remove undefined fields from villaData
//     Object.keys(villaData).forEach(key => {
//       if (villaData[key] === undefined) {
//         delete villaData[key];
//       }
//     });

//      updateVilla = await Villa.findByIdAndUpdate(id, villaData, { new: true });

//     if (!updateVilla) {
//       return res.status(404).json({ message: 'Villa not found' });
//     }

//     res.status(200).json(updateVilla);
//   } catch (error) {
//     console.error('Error updating villa:', error);  // Log detailed error
//     res.status(500).json({ message: 'Something went wrong on the server', error: error.message });
//   }
// });
// router.put('/:id', upload.single('Imageview'), async (req, res) => {
//   try {
//     const { id } = req.params;

//     const villaData = {
//       Villaname: req.body.Villaname,
//       price: req.body.price,
//       location: req.body.location,
//       place: req.body.place,
//       guest: req.body.guest,
//       bedrooms: req.body.bedrooms,
//       area: req.body.area,
//       bathrooms: req.body.bathrooms,
//       Imageview: req.file ? req.file.path : undefined,
//     };

//     // Remove undefined fields
//     Object.keys(villaData).forEach(key => villaData[key] === undefined && delete villaData[key]);

//     const updatedVilla = await Villa.findByIdAndUpdate(id, villaData, { new: true });

//     if (!updatedVilla) {
//       return res.status(404).json({ message: 'Villa not found' });
//     }

//     res.status(200).json(updatedVilla);
//   } catch (error) {
//     console.error('Error updating villa:', error);
//     res.status(500).json({ message: 'Something went wrong on the server', error: error.message });
//   }
// });


// DELETE a villa (admin only)
router.delete('/:id', deleteVilla);

// GET a single villa by ID
router.get('/:id', getVillaById);

module.exports = router;
