# JavaScript Package Suggester Web App with Groq API and live voice inputs

An intuitive web application that helps developers find the right JavaScript packages for their projects using AI-powered recommendations. Uses Groq API

> **Get the Advanced Version!** 
> The enhanced version with memory management and multiple project history tracking is available on my Patreon. By becoming a patron, you'll get access to 350+ LLM projects and my 1000x Cursor Course!
> [Get Advanced Version Here](https://www.patreon.com/posts/javascript-with-116268079)

## How to Use

1. Enter your project requirements or description in the text area
2. Click "Get Suggestions" to receive package recommendations
3. Browse through the suggested packages
4. Click on any package to see more details and installation instructions

## Features

- Interactive web interface for easy package discovery
- Real-time AI-powered package suggestions
- Detailed package information and use cases
- User-friendly search and filtering options
- Modern, responsive design

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file with your GROQ API key:
   ```
   GROQ_API_KEY=your_api_key_here
   ```

## Running the Web App

1. Start the server:
   ```
   uvicorn main:app --reload
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8000 or whatever port you specified
   ```

## Backend API

The web app is powered by a FastAPI backend with the following endpoint:

- `POST /suggest`: Get package recommendations
  - Input: JSON with `description` field
  - Output: List of recommended packages with descriptions

## Requirements

See `requirements.txt` for the list of Python dependencies.

## Browser Compatibility

The web app is compatible with:
- Chrome for sure, not sure about other browsers
