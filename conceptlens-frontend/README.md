# 🧠 ConceptLens AI — AI Misconception Detector for Students

**ConceptLens AI** is an AI-powered learning assistant that helps students identify misconceptions in their answers, understand difficult concepts, and improve their knowledge through personalized feedback.

Built with **Laravel, React, MySQL, and Google Gemini AI**, this project demonstrates how to develop a full-stack application using REST APIs and generative AI.

## ✨ Features

- 📝 **Student Answer Analysis** — Analyze answers using study notes and questions.
- 🤖 **AI Misconception Detection** — Identify potential misunderstandings.
- 💡 **Simple Explanations** — Explain concepts in easy-to-understand English.
- ✅ **Corrected Answers** — Generate improved answers based on study materials.
- 📚 **Evidence-Based Feedback** — Connect feedback to the student's supplied notes.
- 🎯 **Practice Questions** — Generate follow-up questions to reinforce learning.
- 🗂️ **Analysis History** — Save and revisit previous analyses.
- 🗑️ **History Management** — Delete saved analyses.
- 📱 **Responsive Interface** — Use the dashboard on desktop and mobile devices.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| PHP | Backend programming |
| Laravel | REST API and application logic |
| MySQL | Database |
| React | Frontend user interface |
| JavaScript | Frontend functionality |
| Google Gemini API | AI-powered answer analysis |
| Vite | Frontend development server |
| Postman | API testing |

## 🏗️ Application Architecture

```text
                 Student
                    |
                    v
             React Frontend
                    |
                    v
             Laravel REST API
                    |
           +--------+--------+
           |                 |
           v                 v
       Gemini AI            MySQL
           |                 |
           v                 v
      AI Feedback      Saved Analyses
           |                 |
           +--------+--------+
                    |
                    v
             React Dashboard
```

## 📂 Project Structure

The project uses two separate applications.

```text
ConceptLens-AI/
│
├── conceptlens-api/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   └── AnalysisController.php
│   │   ├── Models/
│   │   │   └── Analysis.php
│   │   └── Services/
│   │       └── GeminiMisconceptionService.php
│   ├── config/
│   │   └── services.php
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   ├── .env.example
│   └── artisan
│
├── conceptlens-frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## ⚙️ Prerequisites

Install the following before running the application:

- PHP 8.3 or a version supported by your Laravel release
- Composer
- Node.js and npm
- MySQL
- Git
- Google Gemini API key
- Postman (optional, for API testing)

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ConceptLens-AI.git

cd ConceptLens-AI
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Configure the Laravel backend

```bash
cd conceptlens-api

composer install

cp .env.example .env

php artisan key:generate
```

On Windows PowerShell, if copying the environment file is needed:

```powershell
Copy-Item .env.example .env
```

### 3. Create the MySQL database

Create a database named:

```sql
CREATE DATABASE conceptlens;
```

Update the database settings in `conceptlens-api/.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=conceptlens
DB_USERNAME=root
DB_PASSWORD=
```

Use your own MySQL username and password.

### 4. Configure Gemini AI

Create an API key through [Google AI Studio](https://aistudio.google.com/api-keys).

Add the following to `conceptlens-api/.env`:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model
```

Replace the placeholders with your API key and a model supported by your Gemini API access.

Ensure that `config/services.php` contains the corresponding Gemini configuration:

```php
'gemini' => [
    'key' => env('GEMINI_API_KEY'),
    'model' => env('GEMINI_MODEL'),
],
```

Never commit your real API key or `.env` file to GitHub.

### 5. Run database migrations

```bash
php artisan optimize:clear

php artisan migrate
```

This creates the database tables required by the application.

### 6. Start the Laravel server

```bash
php artisan serve
```

The backend should now be available at:

```text
http://127.0.0.1:8000
```

Test the health endpoint:

```text
GET http://127.0.0.1:8000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "ConceptLens API is working!"
}
```

### 7. Configure the React frontend

Open a second terminal from the repository root:

```bash
cd conceptlens-frontend

npm install

npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

Make sure `vite.config.js` proxies `/api` requests to `http://127.0.0.1:8000`.

## 🔌 REST API Endpoints

The following endpoints are implemented in the initial version.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API status |
| POST | `/api/analyses` | Analyze a student's answer |
| GET | `/api/analyses` | Retrieve recent analyses |
| GET | `/api/analyses/{id}` | Retrieve a specific analysis |
| DELETE | `/api/analyses/{id}` | Delete an analysis |

### Example: Analyze a Student Answer

**Request**

```http
POST /api/analyses
Content-Type: application/json
Accept: application/json
```

**Request body**

```json
{
  "topic": "SQL WHERE vs HAVING",
  "notes": "WHERE filters individual rows before grouping. HAVING filters groups after aggregation. WHERE can filter employees by salary before grouping. HAVING can filter groups using aggregate functions like COUNT.",
  "question": "What is the difference between WHERE and HAVING?",
  "student_answer": "WHERE filters groups and HAVING filters individual rows."
}
```

**Successful response**

The API returns HTTP `201 Created` with the saved analysis and its AI-generated feedback.

Example feedback:

```json
{
  "verdict": "incorrect",
  "misconception": "The student has reversed WHERE and HAVING.",
  "explanation": "WHERE filters rows before grouping, while HAVING filters groups after aggregation.",
  "corrected_answer": "WHERE filters individual rows. HAVING filters grouped results.",
  "note_evidence": "WHERE filters individual rows before grouping. HAVING filters groups after aggregation.",
  "follow_up_question": "Which clause would filter groups with more than five employees?"
}
```

Gemini's actual wording may vary.

## 🧪 Testing

### Test with Postman

1. Start Laravel using `php artisan serve`.
2. Create a new POST request to `http://127.0.0.1:8000/api/analyses`.
3. Select **Body → raw → JSON**.
4. Add the sample request body above.
5. Set `Accept: application/json` and `Content-Type: application/json`.
6. Click **Send**.
7. Verify the response and check the saved record in MySQL.

### Common Issues

| Problem | Possible solution |
|---|---|
| Database connection error | Check MySQL and `.env` credentials |
| Gemini HTTP 400 | Verify model name and request format |
| Gemini HTTP 403 | Check API key permissions |
| Gemini HTTP 429 | Check quota and rate limits |
| HTTP 422 | Check request validation errors |
| React API connection error | Check both servers and the Vite proxy |
| Controller not found | Verify namespace, filename, and imports |

Laravel logs are available at:

```text
storage/logs/laravel.log
```

## 🔐 Security Considerations

This is a learning project and its initial implementation is intended for local development.

Before deploying publicly:

- Add authentication and authorization.
- Ensure users can access only their own analyses.
- Protect deletion and other modifying endpoints.
- Keep API keys in environment variables.
- Apply rate limits and input validation.
- Review AI data handling and privacy requirements.
- Avoid logging API keys or sensitive student information.

The current history and deletion endpoints do not implement per-user authorization.

## 🎯 Learning Objectives

This project provides practical experience with:

- Building REST APIs using Laravel.
- Designing database schemas and migrations.
- Using Eloquent models.
- Integrating Google Gemini into a backend service.
- Prompt engineering and structured JSON output.
- Validating AI-generated responses.
- Connecting React to Laravel APIs.
- Handling asynchronous requests and errors.
- Testing APIs using Postman.
- Organizing a full-stack application for GitHub.

## 🔮 Future Improvements

- [ ] User registration and login
- [ ] Student-specific analysis history
- [ ] Automatic quiz generation
- [ ] PDF lecture-note uploads
- [ ] Topic-wise learning progress dashboard
- [ ] Repeated misconception tracking
- [ ] Export feedback as PDF
- [ ] Unit and feature tests
- [ ] Deployment with production security
- [ ] Improved accessibility and multilingual feedback

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork this repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a pull request.

## 📄 License

This project is intended for educational and portfolio purposes. If you plan to distribute it publicly, choose a license such as MIT and add a corresponding `LICENSE` file.

## 👨‍💻 Author

**Your Name**

- GitHub: https://github.com/YOUR_USERNAME

---

⭐ If you find this project useful, consider giving the repository a star.
