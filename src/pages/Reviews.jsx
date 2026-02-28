import { useState } from "react"
import { useBookClub } from "@/context/BookClubContext"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Star, Heart } from "lucide-react"
import { motion } from "framer-motion"

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-5 w-5 cursor-pointer transition-colors ${
            s <= value
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
          }`}
          onClick={() => onChange && onChange(s)}
        />
      ))}
    </div>
  )
}

export default function Reviews() {
  const { books, addReview } = useBookClub()
  const { user } = useAuth()

  const [selectedBook, setSelectedBook] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [rating, setRating] = useState(0)
  const [text, setText] = useState("")

  const book = books.find((b) => b.id === selectedBook)

  const allReviews =
    selectedBook && selectedBook !== "all"
      ? book?.reviews || []
      : books.flatMap((b) =>
          b.reviews.map((r) => ({
            ...r,
            bookTitle: b.title,
          }))
        )

  const sortedReviews = [...allReviews].sort((a, b) =>
    sortBy === "date"
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : b.rating - a.rating
  )

  const handleSubmit = () => {
    if (!selectedBook || !rating || !text.trim()) return

    addReview({
      userId: user?.id || "guest",
      userName: user?.email || "Guest",
      bookId: selectedBook,
      rating,
      text,
    })

    setRating(0)
    setText("")
  }

  const avgRating =
    book && book.ratings.length
      ? book.ratings.reduce((a, r) => a + r.value, 0) /
        book.ratings.length
      : 0

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-bold">
          Ratings & Reviews
        </h1>
        <p className="text-muted-foreground mt-1">
          Rate books and read what others think.
        </p>
      </div>

      {/* Book Filter */}
      <div className="flex gap-2 flex-wrap">
        <Select value={selectedBook} onValueChange={setSelectedBook}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="All books" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All books</SelectItem>
            {books.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setSortBy((s) => (s === "date" ? "rating" : "date"))
          }
        >
          Sort: {sortBy === "date" ? "Newest" : "Highest Rated"}
        </Button>
      </div>

      {/* Book Summary */}
      {book && selectedBook !== "all" && (
        <Card>
          <CardContent className="p-4 flex items-center gap-6">
            <div className="w-16 h-24 rounded-lg bg-primary/10 flex items-center justify-center font-bold">
              {book.title[0]}
            </div>

            <div>
              <h3 className="font-display font-semibold text-lg">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                by {book.author}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <StarRating value={Math.round(avgRating)} />
                <span className="text-sm font-semibold">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({book.ratings.length} ratings, {book.reviews.length} reviews)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Write Review */}
      {selectedBook && selectedBook !== "all" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">
              Write a Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StarRating value={rating} onChange={setRating} />
            <Textarea
              placeholder="Share your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button onClick={handleSubmit}>
              Submit Review
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {sortedReviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium">
                      {review.userName}
                    </span>
                    {review.bookTitle && (
                      <span className="text-xs text-muted-foreground ml-2">
                        on {review.bookTitle}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>

                <StarRating value={review.rating} />
                <p className="text-sm mt-2">{review.text}</p>

                <div className="flex items-center gap-1 mt-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {review.likes}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}