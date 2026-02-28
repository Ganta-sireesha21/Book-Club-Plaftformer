import { useState } from "react"
import { useBookClub } from "@/context/BookClubContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles, Star, Search, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { genres } from "@/lib/store"

export default function Discover() {
  const { books, library, addToLibrary } = useBookClub()

  const [genreFilter, setGenreFilter] = useState("all")
  const [search, setSearch] = useState("")

  const inLibrary = new Set(library.map((l) => l.bookId))

  const recommendations = books
    .filter((b) => !inLibrary.has(b.id))
    .sort((a, b) => {
      const avgA = a.ratings.length
        ? a.ratings.reduce((s, r) => s + r.value, 0) /
          a.ratings.length
        : 0

      const avgB = b.ratings.length
        ? b.ratings.reduce((s, r) => s + r.value, 0) /
          b.ratings.length
        : 0

      return avgB - avgA
    })

  const allBooks = books.filter((b) => {
    if (genreFilter !== "all" && b.genre !== genreFilter)
      return false

    if (
      search &&
      !b.title.toLowerCase().includes(search.toLowerCase()) &&
      !b.author.toLowerCase().includes(search.toLowerCase())
    )
      return false

    return true
  })

  const renderImage = (book, height = "h-52") => (
    <div className={`${height} w-full overflow-hidden`}>
      {book.image ? (
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x450?text=No+Cover"
          }}
        />
      ) : (
        <div className="h-full bg-muted flex items-center justify-center">
          <span className="text-3xl font-display font-bold text-muted-foreground">
            {book.title[0]}
          </span>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-accent" />
          Discover Books
        </h1>
        <p className="text-muted-foreground mt-1">
          Find your next great read based on club activity.
        </p>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold mb-3">
            Recommended for You
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {recommendations.map((book, i) => {
              const avg = book.ratings.length
                ? (
                    book.ratings.reduce(
                      (s, r) => s + r.value,
                      0
                    ) / book.ratings.length
                  ).toFixed(1)
                : "—"

              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="shrink-0 w-48"
                >
                  <Card className="overflow-hidden h-full">
                    {renderImage(book, "h-40")}

                    <CardContent className="p-3 space-y-1">
                      <h3 className="font-display font-semibold text-sm truncate">
                        {book.title}
                      </h3>

                      <p className="text-xs text-muted-foreground">
                        {book.author}
                      </p>

                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="text-xs font-medium">
                          {avg}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs mt-2"
                        onClick={() =>
                          addToLibrary(book.id, "to-read")
                        }
                      >
                        <BookOpen className="h-3 w-3 mr-1" />
                        Add to Library
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Genres
            </SelectItem>

            {genres.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allBooks.map((book, i) => {
          const avg = book.ratings.length
            ? (
                book.ratings.reduce(
                  (s, r) => s + r.value,
                  0
                ) / book.ratings.length
              ).toFixed(1)
            : "—"

          const isInLib = inLibrary.has(book.id)

          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="overflow-hidden">
                {renderImage(book)}

                <CardContent className="p-4 space-y-2">
                  <h3 className="font-display font-semibold truncate">
                    {book.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {book.author}
                  </p>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {book.genre}
                      </Badge>

                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="text-xs font-medium">
                          {avg}
                        </span>
                      </div>
                    </div>

                    {!isInLib ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          addToLibrary(book.id, "to-read")
                        }
                      >
                        + Library
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        In Library
                      </Badge>
                    )}
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