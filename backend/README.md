# SS Holdings Backend

This is the backend API for the SS Holdings car export website. It provides endpoints for managing vehicles, user authentication, and image uploads.

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB
- JWT Authentication

## Project Structure

```
src/
├── config/        # Configuration files
├── controllers/   # Request handlers
├── middleware/    # Custom middleware
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── utils/         # Utility functions
└── index.ts       # Entry point
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` with your configuration
4. Run the development server:
   ```
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start the production server
- `npm run lint` - Run linting
- `npm run seed` - Seed the database with initial data

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile (requires authentication)

### Vehicles

- `GET /api/vehicles` - Get all vehicles with filtering, pagination, and sorting
- `GET /api/vehicles/:id` - Get vehicle by ID
- `GET /api/vehicles/featured/list` - Get featured vehicles
- `GET /api/vehicles/recent/list` - Get recently added vehicles
- `POST /api/vehicles` - Create new vehicle (requires admin)
- `PUT /api/vehicles/:id` - Update vehicle (requires admin)
- `DELETE /api/vehicles/:id` - Delete vehicle (requires admin)

### Uploads

- `POST /api/uploads` - Upload an image (requires admin)
- `DELETE /api/uploads/:filename` - Delete an image (requires admin)

### Brand Image Upload

The system supports uploading brand/make images via the admin interface. These images are stored on the SFTP server and can be used in the frontend.

### How it works

1. Brand images are stored in the SFTP server at `/home/ssholdings/public_html/uploads/brands/`
2. The images are accessible via the CDN at `https://cdn.ss.holdings/uploads/brands/`
3. The options model has been extended to include `imageUrl` and `svgUrl` fields
4. The admin interface allows uploading both PNG/JPG and SVG versions of the brand logos
5. The frontend components (BrandsSidebar and BrandsSection) use these images with fallbacks

### API Endpoints

- `POST /api/options/:id/upload-image` - Upload a brand image for a specific make

### Usage

1. Go to the admin dashboard
2. Navigate to Options > Makes
3. Click on the "Upload" button next to a make
4. Select an image file (PNG, JPG, or SVG)
5. The image will be uploaded and associated with the make

### Frontend Components

The following components have been updated to use the brand images:

- `BrandsSidebar` - Shows brand logos in the sidebar
- `BrandsSection` - Shows brand logos in the brands section on the homepage

Both components use a fallback mechanism if the image fails to load.

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development, production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRATION` - JWT expiration time
- `CORS_ORIGIN` - Allowed CORS origin

## Database Seeding

To seed the database with initial data:

```
npm run seed
```

This will create an admin user and sample vehicles.

Default admin credentials:
- Email: admin@ssholdings.com
- Password: admin123

## Deployment

The API is designed to be deployed on Railway. Make sure to set all required environment variables in the Railway dashboard. 