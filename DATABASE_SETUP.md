# MongoDB Database Setup for Pocket Doctor

## Prerequisites
1. MongoDB installed and running on your system
2. MongoDB Compass installed (optional, for GUI management)

## Setup Steps

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if installed as service)
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

### 2. Initialize Database
Visit the following URL in your browser to initialize the database:
```
http://localhost:9002/api/setup
```

This will:
- Create the `pocket_doctor` database
- Create collections: `patients`, `doctors`, `caretakers`, `appointments`
- Insert sample data for testing

### 3. Verify in MongoDB Compass
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Navigate to the `pocket_doctor` database
4. You should see the following collections:
   - `patients` - Patient information and medications
   - `doctors` - Doctor information and specializations
   - `caretakers` - Caretaker information and relationships
   - `appointments` - Appointment schedules

## Database Structure

### Patients Collection
- Patient personal information
- Medical history (allergies, conditions)
- Current medications and dosages
- Emergency contacts
- Next appointment dates

### Doctors Collection
- Doctor personal information
- Specialization
- List of assigned patient IDs
- Contact information

### Caretakers Collection
- Caretaker personal information
- Relationship to patient
- Linked patient ID
- Contact information

### Appointments Collection
- Appointment details (date, time, description)
- Patient and doctor references
- Appointment status (scheduled, completed, cancelled)

## Testing the Application

1. Start the application: `npm run dev`
2. Visit: `http://localhost:9002`
3. Login with any user (password: `123`)
4. Scroll down to see the "Database Information" section
5. This shows real-time data from MongoDB

## Data Visibility by Role

### Patient View
- Personal information
- Assigned doctor details
- Current medications
- Upcoming appointments

### Doctor View
- Personal information
- List of assigned patients
- Patient medical details
- Upcoming appointments

### Caretaker View
- Personal information
- Linked patient details
- Patient's doctor information
- Patient's medications and appointments

## Troubleshooting

If you encounter connection issues:
1. Ensure MongoDB is running: `mongod --version`
2. Check connection string: `mongodb://localhost:27017`
3. Verify database initialization: Visit `/api/setup`
4. Check browser console for errors
5. Restart the application if needed
