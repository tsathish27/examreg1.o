// const mongoose = require('mongoose');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const port = 3001;

// app.use(cors());
// app.use(bodyParser.json());
// app.use('/uploads', express.static('uploads'));

// // Ensure the uploads directory exists
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// // Connect to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/examreg', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Define Student Schema
// const studentSchema = new mongoose.Schema({
//   rollNumber: String,
//   name: String,
//   gender: String,
//   email: String,
//   branch: String,
//   year: String,
//   eligible: Boolean,
//   approved: Boolean,
// });

// const Student = mongoose.model('Student', studentSchema);

// // Define Registration Schema
// const registrationSchema = new mongoose.Schema({
//   rollNumber: String,
//   name: String,
//   gender: String,
//   email: String,
//   branch: String,
//   year: String,
//   imageUrl: String,
//   registrationDate: { type: Date, default: Date.now },
// });

// const Registration = mongoose.model('Registration', registrationSchema);

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   }
// });
// const upload = multer({ storage });

// // Endpoint to register a student
// app.post('/register', upload.single('image'), async (req, res) => {
//   try {
//     const { rollNumber, name, gender, email, branch, year } = req.body;
//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

//     const registration = new Registration({
//       rollNumber,
//       name,
//       gender,
//       email,
//       branch,
//       year,
//       imageUrl,
//     });

//     await registration.save();
//     res.json({ success: true, message: 'Registration successful' });
//   } catch (error) {
//     console.error('Error registering student:', error);
//     res.status(500).json({ success: false, message: 'Registration failed' });
//   }
// });

// // Endpoint to check eligibility
// app.get('/check-eligibility/:rollNumber', async (req, res) => {
//   const rollNumber = req.params.rollNumber;
//   console.log(`Checking eligibility for roll number: ${rollNumber}`);
  
//   try {
//     const student = await Student.findOne({ rollNumber: rollNumber });
//     if (student) {
//       console.log(`Student found: ${JSON.stringify(student)}`);
//       res.json({ eligible: student.eligible });
//     } else {
//       console.log(`Student with roll number ${rollNumber} not found.`);
//       res.status(404).json({ message: 'Student not found' });
//     }
//   } catch (error) {
//     console.error('Error retrieving student:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// Existing imports and setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/examreg', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Student Schema
const studentSchema = new mongoose.Schema({
  rollNumber: String,
  name: String,
  gender: String,
  email: String,
  branch: String,
  year: String,
  eligible: Boolean,
  approved: Boolean,
});

const Student = mongoose.model('Student', studentSchema);

// Define Registration Schema
const registrationSchema = new mongoose.Schema({
  rollNumber: String,
  name: String,
  gender: String,
  email: String,
  branch: String,
  year: String,
  imageUrl: String,
  registrationDate: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
});

const Registration = mongoose.model('Registration', registrationSchema);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

// Endpoint to register a student
app.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { rollNumber, name, gender, email, branch, year } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const registration = new Registration({
      rollNumber,
      name,
      gender,
      email,
      branch,
      year,
      imageUrl,
    });

    await registration.save();
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Endpoint to check eligibility
app.get('/check-eligibility/:rollNumber', async (req, res) => {
  const rollNumber = req.params.rollNumber;
  console.log(`Checking eligibility for roll number: ${rollNumber}`);
  
  try {
    const student = await Student.findOne({ rollNumber: rollNumber });
    if (student) {
      console.log(`Student found: ${JSON.stringify(student)}`);
      res.json({ eligible: student.eligible });
    } else {
      console.log(`Student with roll number ${rollNumber} not found.`);
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error retrieving student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to fetch all student registrations for HOD
app.get('/students', async (req, res) => {
  try {
    const students = await Registration.find({});
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Endpoint to approve a student
app.post('/approve', async (req, res) => {
  const { rollNumber } = req.body;
  try {
    const student = await Registration.findOneAndUpdate(
      { rollNumber },
      { approved: true },
      { new: true }
    );
    if (student) {
      res.json({ success: true, message: 'Student approved' });
    } else {
      res.status(404).json({ success: false, message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error approving student:', error);
    res.status(500).json({ message: 'Error approving student' });
  }
});

// Add this at the bottom of the file

const PDFDocument = require('pdfkit');
 
 

app.get('/generate-hall-ticket/:rollNumber', async (req, res) => {
  const { rollNumber } = req.params;
  
  try {
    const student = await Registration.findOne({ rollNumber });
    if (!student || !student.approved) {
      return res.status(404).send('Student not found or not approved.');
    }

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'halltickets', `${rollNumber}.pdf`);

    doc.pipe(fs.createWriteStream(filePath));
    
    // // Add content to the PDF
    // doc.image('D:\\mycode\\EXAMREG_TEST\\backend\\assets\\Designer (2).jpeg', { width: 150, height: 150 });

    // doc.moveDown();
    // doc.fontSize(20).text('Hall Ticket', { align: 'center' });
    // doc.moveDown();
    // doc.fontSize(14).text(`Roll Number: ${student.rollNumber}`);
    // doc.text(`Name: ${student.name}`);
    // doc.text(`Gender: ${student.gender}`);
    // doc.text(`Branch: ${student.branch}`);
    // doc.text(`Year: ${student.year}`);
    // doc.moveDown();
    // doc.image(`uploads/${student.imageUrl.split('/').pop()}`, { width: 100, height: 100 });
    
    // doc.end();

    // Title
doc.fontSize(24).fillColor('#333').text('Hall Ticket', { align: 'center' });
doc.moveDown();

// Student Information
doc.fontSize(14).fillColor('#555');
doc.text(`Roll Number: ${student.rollNumber}`, { continued: true });
doc.text(`Name: ${student.name}`, { continued: true });
doc.text(`Gender: ${student.gender}`, { continued: true });
doc.text(`Branch: ${student.branch}`, { continued: true });
doc.text(`Year: ${student.year}`, { align: 'left' });
doc.moveDown();
const imagePath = `uploads/${student.imageUrl.split('/').pop()}`;
doc.image(imagePath, { fit: [100, 100], align: 'center', valign: 'center' });

doc.end();

    res.download(filePath, `Hall_Ticket_${rollNumber}.pdf`, (err) => {
      if (err) {
        console.error('Error sending the file:', err);
      } else {
        console.log(`Hall ticket generated for ${rollNumber}`);
      }
    });
  } catch (error) {
    console.error('Error generating hall ticket:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
