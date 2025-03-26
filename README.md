# GameGo

A modern game hosting platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Modern and responsive UI
- Game upload and hosting
- User authentication
- Game discovery and browsing
- Category-based organization
- Database integration with Prisma
- API routes for data operations

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (for database)
- SQLite (development) / PostgreSQL (production)
- NextAuth.js (for authentication)
- Axios (for API requests)
- bcryptjs (for password hashing)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gamego.git
cd gamego
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Initialize the database:
```bash
npx prisma migrate dev --name init
```

5. Seed the database with initial data:
```bash
npx ts-node scripts/seed.ts
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

- Generate Prisma client:
```bash
npm run prisma:generate
```

- Create a database migration:
```bash
npm run prisma:migrate
```

- Open Prisma Studio (database GUI):
```bash
npm run prisma:studio
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Games
- `GET /api/games` - Get all games
- `POST /api/games` - Create a new game
- `GET /api/games/[id]` - Get a specific game
- `POST /api/games/[id]` - Increment download count
- `POST /api/games/[id]/comments` - Add a comment to a game

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/[tag]` - Get games by tag

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   ├── games/       # Game pages
│   └── layout.tsx   # Root layout
├── components/      # Reusable components
├── contexts/        # React contexts
├── lib/             # Utility functions and database helpers
├── types/           # TypeScript types
└── prisma/          # Prisma schema and migrations
```

## Seed Data

The seed script creates:
- 8 game tags
- 2 users (john@example.com and jane@example.com, both with password123)
- 3 sample games
- Sample comments

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 