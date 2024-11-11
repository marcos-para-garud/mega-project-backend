



# Video Tweet - A Social Media Platform

## Description
Video Tweet is a platform where users can upload and share videos, tweet, like, and comment on content, create playlists, and follow channels. This project integrates Docker, Jenkins for CI/CD, and is deployed on Render. The application follows the MERN stack (MongoDB, Express, React, Node.js) and is structured with a microservices architecture.

## Features
- **User Authentication**: Register, log in, and manage user profiles.
- **Tweeting**: Create, update, and delete tweets.
- **Video Upload**: Upload videos, manage their details (e.g., thumbnail, publishing status), and like/dislike them.
- **Commenting**: Add, edit, and delete comments on videos.
- **Subscriptions**: Subscribe to channels and manage subscriptions.
- **Playlists**: Create and manage playlists, add or remove videos.
- **Like/Dislike**: Like videos, tweets, or comments.

## Technologies Used
- **Node.js**: Backend API server.
- **Express.js**: Web framework for routing.
- **MongoDB**: Database for storing user, video, tweet, comment, and subscription data.
- **Docker**: Containerization for deployment and portability.
- **Jenkins**: CI/CD pipeline automation for deployment.
- **Render**: Cloud platform for hosting the application.
- **JWT Authentication**: Secure access to user routes.
- **Multer**: Handling file uploads (avatars, cover images, videos, thumbnails).
- **Cloudinary**: Cloud-based platform for uploading photos and videos.

## Setup & Installation

### Prerequisites
- **Node.js** (v14+)
- **Docker** (for containerization)
- **MongoDB** (for database)
- **Jenkins** (for CI/CD automation)

### Step 1: Clone the Repository
```bash
git clone https://github.com/marcos-para-garud/mega-project-backend.git
cd backend-mega-project


Step 2: Install Dependencies
bash
Copy code
npm install
Docker Setup
Running the App with Docker
This project uses Docker to containerize the application, ensuring consistency across different environments (development, testing, production).

Step 1: Install Docker
Make sure you have Docker installed. If not, download Docker and follow the installation instructions for your platform.

Step 2: Set Up Docker-Compose
This project uses Docker Compose to manage multiple containers for the backend, database, and other services.

Build Docker Images
From the project root directory, run the following command to build the Docker images:

bash
Copy code
docker-compose build
Run the Containers
After building the images, start the containers with:

bash
Copy code
docker-compose up
This will start the MongoDB database, Node.js server, and other services defined in the docker-compose.yml file.

Access the Application
Once the containers are running, the backend API will be accessible at http://localhost:8000.

API Endpoints
🗨️ Comment API Endpoints

All routes require Authentication.

GET /api/v1/comments/
Description: Fetch all comments for a specific video.
Path Parameters: videoId (string) - ID of the video.
Response: List of comments.

POST /api/v1/comments/
Description: Add a comment to a specific video.
Path Parameters: videoId (string) - ID of the video.
Body:
json
Copy code
{ "text": "Your comment here" }
Response: Details of the created comment.

DELETE /api/v1/comments/c/
Description: Delete a specific comment.
Path Parameters: commentId (string) - ID of the comment to be deleted.
Response: Deletion confirmation.

PATCH /api/v1/comments/c/
Description: Update a specific comment.
Path Parameters: commentId (string) - ID of the comment to be updated.
Body:
json
Copy code
{ "text": "Updated comment text" }
Response: Updated comment details.


📊 Dashboard API Endpoints
GET /api/v1/dashboard/stats/
Description: Get statistics for a specific channel.
Path Parameters: channelId (string) - ID of the channel.
Response: Channel statistics data.

GET /api/v1/dashboard/video/
Description: Fetch all videos of a specific channel.
Path Parameters: channelId (string) - ID of the channel.
Response: List of videos.


🩺 Healthcheck API Endpoint
GET /api/v1/healthcheck
Description: Checks if the server is up and running.
Response:
json
Copy code
{ "status": "OK", "message": "Server is healthy" }


👍 Like API Endpoints
All routes require Authentication.

POST /api/v1/likes/toggle/v/
Description: Like or unlike a specific video.
Path Parameters: videoId (string) - ID of the video.
Response: Liking status (liked or unliked).

POST /api/v1/likes/toggle/c/
Description: Like or unlike a specific comment.
Path Parameters: commentId (string) - ID of the comment.
Response: Liking status (liked or unliked).

POST /api/v1/likes/toggle/t/
Description: Like or unlike a specific tweet.
Path Parameters: tweetId (string) - ID of the tweet.
Response: Liking status (liked or unliked).

GET /api/v1/likes/videos
Description: Get all liked videos by the user.
Response: List of liked videos.


📚 Playlist API Endpoints
All routes require Authentication.

POST /api/v1/playlist/
Description: Create a new playlist.
Body:
json
Copy code
{ "title": "My Playlist", "description": "Description of the playlist" }
Response: Playlist creation confirmation.

GET /api/v1/playlist/
Description: Get details of a specific playlist.
Path Parameters: playlistId (string) - ID of the playlist.
Response: Playlist details.

PATCH /api/v1/playlist/
Description: Update a specific playlist.
Path Parameters: playlistId (string) - ID of the playlist.
Body:
json
Copy code
{ "title": "Updated Playlist Title", "description": "Updated description" }
Response: Updated playlist details.

DELETE /api/v1/playlist/
Description: Delete a specific playlist.
Path Parameters: playlistId (string) - ID of the playlist to be deleted.
Response: Playlist deletion confirmation.

PATCH /api/v1/playlist/add/
/
Description: Add a video to a specific playlist.
Path Parameters: videoId (string) - ID of the video, playlistId (string) - ID of the playlist.
Response: Video added to the playlist.

PATCH /api/v1/playlist/remove/
/
Description: Remove a video from a specific playlist.
Path Parameters: videoId (string) - ID of the video, playlistId (string) - ID of the playlist.
Response: Video removed from the playlist.

GET /api/v1/playlist/user/
Description: Get all playlists of a user.
Path Parameters: userId (string) - ID of the user.
Response: List of user playlists.


🔔 Subscription API Endpoints
All routes require Authentication.

GET /api/v1/subscriptions/c/
Description: Get subscribers of a specific channel.
Path Parameters: channelId (string) - ID of the channel.
Response: List of subscribers.

POST /api/v1/subscriptions/c/
Description: Subscribe or unsubscribe from a specific channel.
Path Parameters: channelId (string) - ID of the channel.
Response: Subscription status.

GET /api/v1/subscriptions/u/
Description: Get all subscriptions of a user.
Path Parameters: subscriberId (string) - ID of the subscriber.
Response: List of subscribed channels.


📜 Tweet API Endpoints
All routes require Authentication.

POST /api/v1/tweets/
Description: Create a new tweet.
Body:
json
Copy code
{ "content": "This is a tweet" }
Response: Tweet creation confirmation.

GET /api/v1/tweets/user/
Description: Get all tweets from a specific user.
Path Parameters: userId (string) - ID of the user.
Response: List of tweets.

GET /api/v1/tweets/
Description: Get details of a specific tweet.
Path Parameters: tweetId (string) - ID of the tweet.
Response: Tweet details.

PATCH /api/v1/tweets/
Description: Update a specific tweet.
Path Parameters: tweetId (string) - ID of the tweet.
Body:
json
Copy code
{ "content": "Updated tweet content" }
Response: Updated tweet details.

DELETE /api/v1/tweets/
Description: Delete a specific tweet.
Path Parameters: tweetId (string) - ID of the tweet.
Response: Tweet deletion confirmation.


Running the App in Docker
Follow the steps to build and run Docker containers as mentioned above.
The application will be running on http://localhost:8000.
CI/CD Pipeline
This project uses Jenkins for continuous integration and deployment. The pipeline automatically builds, tests, and deploys the app to Render.

Conclusion
This project provides a powerful social media platform with features like tweets, video uploads, playlists, commenting, and subscriptions. The use of Docker, Jenkins, and microservices makes it scalable, maintainable, and easily deployable