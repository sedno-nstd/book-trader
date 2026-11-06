import { Request, Response, Router } from "express";
import { prisma } from "../prisma.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, sort = "asc", page = "1", limit = "6" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) | 1);
    const limitNum = Math.max(1, parseInt(limit as string) | 1);
    const skip = (pageNum - 1) * 6;

    const whereClause = search
      ? {
          OR: [
            {
              title: {
                contains: search as string,
                mode: "insensitive" as const,
              },
            },
            {
              author: {
                contains: search as string,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: whereClause,
        skip,
        orderBy: {
          title: sort === "desc" ? "desc" : "asc",
        },
        take: limitNum,
        include: {
          owner: {
            select: {
              email: true,
              name: true,
              id: true,
            },
          },
        },
      }),
      prisma.book.count({ where: whereClause }),
    ]);

    return res.json({
      books,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch books" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const bookId = Number(req.params.id);

    if (isNaN(bookId)) return res.status(400).json("Invalid book id");

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        author: true,
        createdAt: true,
        owner: true,
        photo: true,
        title: true,
      },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.json(book);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch books" });
  }
});

router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, author, photo } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        photo: photo || null,
        ownerId: req.user!.userId || (req.user as any).id,
      },
    });

    return res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create book" });
  }
});

router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const bookId = Number(req.params.id);
      const book = await prisma.book.findUnique({ where: { id: bookId } });

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      if (book.ownerId !== req.user!.userId && req.user!.role !== "ADMIN") {
        return res.status(403).json({ error: "You cannot delete this book" });
      }

      await prisma.book.delete({ where: { id: bookId } });

      return res.json({ message: "Book deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete book" });
    }
  },
);

router.post(
  "/:id/trade",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const bookId = Number(req.params.id);
      const senderId = req.user!.userId || (req.user as any).id;

      const book = await prisma.book.findUnique({
        where: { id: bookId },
        include: { owner: true },
      });

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      if (book.ownerId === senderId) {
        return res
          .status(400)
          .json({ error: "You cannot request a trade for your own book" });
      }

      const sender = await prisma.user.findUnique({ where: { id: senderId } });
      const senderBooks = await prisma.book.findMany({
        where: { ownerId: senderId },
      });

      const booksListText =
        senderBooks.length > 0
          ? senderBooks
              .map((b, i) => `${i + 1}. "${b.title}" (${b.author})`)
              .join("\n")
          : "Sender haven't added books";

      console.log(`
      === 📧 TRADE REQUEST EMAIL SENT ===
      To: ${book.owner.name} <${book.owner.email}>
      From: ${sender?.name} <${sender?.email}>
      Subject: Request to trade book "${book.title}"

      Message:
      Hello ${book.owner.name}!
      User ${sender?.name} (${sender?.email}) wants to trade for your book "${book.title}".

      Here is the list of books available for trade:
      ${booksListText}
    `);

      return res.status(200).json({
        message: "Trade request sent successfully!",
        ownerEmail: book.owner.email,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to process trade request" });
    }
  },
);

export default router;
