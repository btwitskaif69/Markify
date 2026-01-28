<div align="center">

![Markify Banner](https://assets.markify.tech/assets/markify%20og%20image.png)

# Markify

### 🔖 The Modern Bookmark Manager for the Modern Web

**Save, organize, and rediscover the content that matters—without the chaos.**

[![Website](https://img.shields.io/badge/Website-markify.tech-orange?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.markify.tech)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/btwitskaif69/Markify?style=for-the-badge&logo=git&logoColor=white&color=0080ff)](https://github.com/btwitskaif69/Markify/commits)

[Live Demo](https://www.markify.tech) · [What is Markify?](https://www.markify.tech/what-is-markify) · [Blog](https://www.markify.tech/blog) · [Report Bug](https://github.com/btwitskaif69/Markify/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Full-Text Search** | Find any bookmark instantly across titles, descriptions, and tags |
| 📁 **Smart Collections** | Organize bookmarks with custom collections and nested folders |
| 🏷️ **Tags & Filters** | Flexible tagging system for quick categorization |
| 🌐 **Browser Extension** | Save links with one click from Chrome, Firefox, or Edge |
| ☁️ **Cross-Device Sync** | Access your bookmarks from anywhere—web, mobile, or extension |
| 🔒 **Privacy First** | Your data is encrypted and never sold |
| 🌙 **Dark Mode** | Beautiful dark theme that's easy on the eyes |
| 📤 **Import/Export** | Migrate from Chrome, Raindrop, or Pinboard seamlessly |

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Database | Deployment |
|----------|---------|----------|------------|
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) | ![Next.js](https://img.shields.io/badge/Route_Handlers-000000?style=flat&logo=nextdotjs&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) |
| ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white) | ![Cloudflare](https://img.shields.io/badge/Cloudflare_R2-F38020?style=flat&logo=cloudflare&logoColor=white) |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white) | | |

</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **PostgreSQL** database (or use a hosted solution like Supabase/Neon)

### Installation

```bash
# Clone the repository
git clone https://github.com/btwitskaif69/Markify.git

# Navigate to project directory
cd Markify

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and API keys

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev           # http://localhost:3000
```

---

## 📁 Project Structure

```
Markify/
  src/
    app/                         # Next.js App Router
      (auth)/                    # Auth routes (group)
      (public)/                  # Marketing/public routes (group)
      api/                       # Route handlers (backend)
      layout.jsx
      page.jsx
      not-found.jsx
      error.jsx
      loading.jsx
      globals.css
    components/                  # UI components
    hooks/                       # Client hooks
    lib/                         # Client helpers
    server/                      # Server-only logic (used by route handlers)
      config/
      controllers/
      db/
      middleware/
      services/
      utils/
  prisma/                        # Prisma schema & migrations
  public/                        # Static assets
  markify-extension/             # Browser extension
  package.json
  next.config.mjs
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/initiate-signup` | Start signup flow |
| `POST` | `/api/users/verify-email` | Verify email |
| `POST` | `/api/users/login` | User login |
| `POST` | `/api/users/forgot-password` | Request password reset |
| `POST` | `/api/users/reset-password/{token}` | Reset password |
| `GET` | `/api/users/profile` | Get current user profile |
| `PATCH` | `/api/users/profile` | Update profile |
| `GET` | `/api/collections` | List collections |
| `POST` | `/api/collections` | Create collection |
| `POST` | `/api/bookmarks` | Create bookmark |
| `PATCH` | `/api/bookmarks/{bookmarkId}` | Update bookmark |
| `DELETE` | `/api/bookmarks/{bookmarkId}` | Delete bookmark |
| `POST` | `/api/upload` | Upload asset |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Mohd Kaif**

[![GitHub](https://img.shields.io/badge/GitHub-btwitskaif69-181717?style=for-the-badge&logo=github)](https://github.com/btwitskaif69)
[![Twitter](https://img.shields.io/badge/Twitter-@btwitskaif69-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/btwitskaif69)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-btwitskaif69-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/btwitskaif69)

</div>

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Built with ❤️ by [Mohd Kaif](https://github.com/btwitskaif69)

</div>
