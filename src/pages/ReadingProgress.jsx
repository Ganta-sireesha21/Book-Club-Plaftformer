import { useBookClub } from "@/context/BookClubContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function ReadingProgress() {
  const { books, progress, updateProgress, library } =
    useBookClub()

  const [inputs, setInputs] = useState({})

  // Books currently being tracked
  const trackedBooks = books.filter(
    (b) =>
      progress.some((p) => p.bookId === b.id) ||
      library.some(
        (l) =>
          l.bookId === b.id &&
          l.shelf === "reading"
      )
  )

  const handleUpdate = (bookId) => {
    const val = parseInt(inputs[bookId])

    if (!isNaN(val) && val >= 0) {
      updateProgress(bookId, val)

      setInputs((prev) => ({
        ...prev,
        [bookId]: "",
      }))
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-bold">
          Reading Progress
        </h1>
        <p className="text-muted-foreground mt-1">
          Track how far you've gotten in each book.
        </p>
      </div>

      {trackedBooks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>
              No books being tracked. Add books to
              your library to start tracking
              progress.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {trackedBooks.map((book, i) => {
          const p = progress.find(
            (pr) =>
              pr.bookId === book.id &&
              pr.userId === "You"
          )

          const pagesRead = p?.pagesRead || 0
          const total = book.pages || 1 // prevent divide by zero
          const pct = Math.min(
            100,
            Math.round((pagesRead / total) * 100)
          )

          const completed = pct >= 100

          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                className={
                  completed
                    ? "border-green-500/50"
                    : ""
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-20 rounded-lg bg-gradient-to-br ${book.cover} flex items-center justify-center text-white font-bold shrink-0`}
                    >
                      {book.title?.[0]}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold truncate">
                          {book.title}
                        </h3>

                        {completed && (
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        by {book.author}
                      </p>

                      <div className="flex items-center gap-3">
                        <Progress
                          value={pct}
                          className="h-3 flex-1"
                        />
                        <Badge
                          variant={
                            completed
                              ? "default"
                              : "secondary"
                          }
                        >
                          {pct}%
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {pagesRead} / {total} pages
                      </p>

                      {!completed && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            type="number"
                            placeholder="Pages read"
                            value={
                              inputs[book.id] || ""
                            }
                            onChange={(e) =>
                              setInputs((prev) => ({
                                ...prev,
                                [book.id]:
                                  e.target.value,
                              }))
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleUpdate(book.id)
                            }
                            className="w-32"
                          />

                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdate(book.id)
                            }
                          >
                            Update
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}