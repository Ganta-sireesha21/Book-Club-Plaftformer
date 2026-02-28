import { useState } from "react"
import { useBookClub } from "@/context/BookClubContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ThumbsUp, Plus, ArrowUpDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { genres } from "@/lib/store"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function Suggestions() {
  const { books, addBook, voteBook } = useBookClub()

  const [sortBy, setSortBy] = useState("votes")
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    genre: "Sci-Fi",
    pages: "",
    image: "", // ✅ added
  })

  const sorted = [...books].sort((a, b) =>
    sortBy === "votes"
      ? b.votes - a.votes
      : new Date(b.suggestedAt).getTime() -
        new Date(a.suggestedAt).getTime()
  )

  const chartData = sorted.slice(0, 8).map((b) => ({
    name:
      b.title.length > 12
        ? b.title.slice(0, 12) + "…"
        : b.title,
    votes: b.votes,
  }))

  const handleSubmit = () => {
    if (!form.title || !form.author) return

    addBook({
      title: form.title,
      author: form.author,
      description: form.description,
      genre: form.genre,
      pages: parseInt(form.pages) || 300,
      image: form.image, // ✅ changed from cover
      suggestedBy: "You",
    })

    setForm({
      title: "",
      author: "",
      description: "",
      genre: "Sci-Fi",
      pages: "",
      image: "",
    })

    setOpen(false)
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Book Suggestions
          </h1>
          <p className="text-muted-foreground mt-1">
            Suggest books and vote for your favorites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSortBy((s) =>
                s === "votes" ? "date" : "votes"
              )
            }
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {sortBy === "votes"
              ? "By Votes"
              : "By Date"}
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Suggest Book
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">
                  Suggest a Book
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      title: e.target.value,
                    }))
                  }
                />

                <Input
                  placeholder="Author"
                  value={form.author}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      author: e.target.value,
                    }))
                  }
                />

                {/* ✅ Image URL Input */}
                <Input
                  placeholder="Book Cover Image URL"
                  value={form.image}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      image: e.target.value,
                    }))
                  }
                />

                <Textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                />

                <div className="flex gap-2">
                  <Select
                    value={form.genre}
                    onValueChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        genre: v,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {genres.map((g) => (
                        <SelectItem
                          key={g}
                          value={g}
                        >
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Pages"
                    type="number"
                    value={form.pages}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        pages:
                          e.target.value,
                      }))
                    }
                    className="w-24"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full"
                >
                  Submit Suggestion
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Book List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {sorted.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4 flex gap-4">

                  {/* ✅ Image Display */}
                  <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/120x180?text=No+Cover"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                        {book.title[0]}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold truncate">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      by {book.author}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {book.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">
                        {book.genre}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        by {book.suggestedBy}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant={
                      book.voters?.includes("You")
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="shrink-0 flex flex-col items-center h-auto py-2"
                    onClick={() =>
                      voteBook(book.id, "You")
                    }
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-xs mt-1">
                      {book.votes}
                    </span>
                  </Button>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}