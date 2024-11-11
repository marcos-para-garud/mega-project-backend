<<<<<<< HEAD
Video Tweet - A Social Media Platform

Description
Video Tweet is a platform where users can upload and share videos, tweets, like and comment on content, create playlists, and follow channels. This project integrates Docker,
Jenkins for CI/CD, and is deployed on Render. The application follows the MERN stack (MongoDB, Express, React, Node.js) and is structured with a microservices architecture.

Features

User Authentication: Register, log in, and manage user profiles.

Tweeting: Create, update, and delete tweets.

Video Upload: Upload videos, manage their details (e.g., thumbnail, publishing status), and like/dislike them.

Commenting: Add, edit, and delete comments on videos.

Subscriptions: Subscribe to channels and manage subscriptions.

Playlists: Create and manage playlists, add or remove videos.

Like/Dislike: Like videos, tweets, or comments.

Technologies Used

Node.js: Backend API server.

Express.js: Web framework for routing.

MongoDB: Database for storing user, video, tweet, comment, and subscription data.

Docker: Containerization for deployment and portability.

Jenkins: CI/CD pipeline automation for deployment.

Render: Cloud platform for hosting the application.

JWT Authentication: Secure access to user routes.

Multer: Handling file uploads (avatars, cover images, videos, thumbnails).

Cloudinary: photos and videos are uploaded in a cloud based platform.

Setup & Installation

Prerequisites
Node.js (v14+)
Docker (for containerization)
MongoDB (for database)
Jenkins (for CI/CD automation)
Step 1: Clone the Repository
bash

git clone https://github.com/marcos-para-garud/mega-project-backend.git
cd backend-mega-project
Step 2: Install Dependencies
bash

npm install
Docker Setup
Running the App with Docker
This project uses Docker to containerize the application. It ensures consistency across different environments (development, testing, production).

Step 1: Install Docker
Make sure you have Docker installed. If not, download Docker and follow the installation instructions for your platform.

Step 2: Set Up Docker-Compose
This project uses Docker Compose to manage multiple containers for the backend, database, and other services.

Build Docker images:

From the project root directory, run the following command to build the Docker images:

bash

docker-compose build
This will build the necessary Docker containers based on the configuration provided in the docker-compose.yml file.

Run the containers:

After building the images, start the containers with:

bash

docker-compose up
This will start the MongoDB database, Node.js server, and other services defined in the docker-compose.yml file.

Access the Application:

Once the containers are running, the backend API will be accessible at http://localhost:8000.

API Endpoints
User Routes
POST /api/v1/users/register - Register a new user.
POST /api/v1/users/login - Log in a user.
POST /api/v1/users/logout - Log out the current user.
GET /api/v1/users/getCurrentUser - Get the current user’s profile.
PUT /api/v1/users/update-account - Update user details (email, etc.).
Tweet Routes
POST /api/v1/tweets/ - Create a tweet.
GET /api/v1/tweets/user/:userId - Get all tweets from a specific user.
PATCH /api/v1/tweets/:tweetId - Update a tweet.
DELETE /api/v1/tweets/:tweetId - Delete a tweet.
Video Routes
GET /api/v1/videos/ - Get all videos.
POST /api/v1/videos/ - Upload a new video.
GET /api/v1/videos/:videoId - Get video details.
PATCH /api/v1/videos/:videoId - Update video.
DELETE /api/v1/videos/:videoId - Delete a video.
Comment Routes
GET /api/v1/comments/:videoId - Get comments for a video.
POST /api/v1/comments/:videoId - Add a new comment.
PATCH /api/v1/comments/c/:commentId - Update a comment.
DELETE /api/v1/comments/c/:commentId - Delete a comment.
Like Routes
POST /api/v1/likes/toggle/v/:videoId - Like/unlike a video.
POST /api/v1/likes/toggle/c/:commentId - Like/unlike a comment.
POST /api/v1/likes/toggle/t/:tweetId - Like/unlike a tweet.
GET /api/v1/likes/videos - Get all liked videos.
Subscription Routes
POST /api/v1/subscriptions/c/:channelId - Subscribe/unsubscribe to a channel.
GET /api/v1/subscriptions/c/:channelId - Get subscribers of a channel.
GET /api/v1/subscriptions/u/:subscriberId - Get subscriptions of a user.
Playlist Routes
POST /api/v1/playlist - Create a playlist.
GET /api/v1/playlist/:playlistId - Get details of a playlist.
PATCH /api/v1/playlist/:playlistId - Update a playlist.
DELETE /api/v1/playlist/:playlistId - Delete a playlist.
PATCH /api/v1/playlist/add/:videoId/:playlistId - Add a video to a playlist.
PATCH /api/v1/playlist/remove/:videoId/:playlistId - Remove a video from a playlist.
Jenkins CI/CD Pipeline
This project integrates Jenkins for CI/CD automation:

Step 1: Configure Jenkins Pipeline
Create a Jenkins Pipeline that listens for changes in the repository (via GitHub Webhooks).
Build the project and run tests on every push to the repository.
Deploy using Docker: The Docker container is built during the pipeline process and deployed to Render.
Future Enhancements
Add more social media features like messaging, notifications, etc.
Implement video streaming features (e.g., live streaming).
Improve user interaction with better UI/UX designs.
Add more microservices for scalability.


Acknowledgments
Node.js, Express.js, MongoDB, React, and Docker for providing the essential technologies.
Jenkins for CI/CD automation.
Render for cloud hosting and deployment.
=======

>>>>>>> 90f21bb1560d9f4f0676c2870a6fe81728c255ef
