import { useBookClub } from "@/context/BookClubContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Library as LibraryIcon,
  BookOpen,
  CheckCircle,
  Clock,
} from "lucide-react"
import { motion } from "framer-motion"

export default function PersonalLibrary() {
  const { books, library = [], moveToShelf } = useBookClub()

  const shelves = [
    { key: "reading", label: "Currently Reading", icon: BookOpen },
    { key: "read", label: "Read", icon: CheckCircle },
    { key: "to-read", label: "To Read", icon: Clock },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <LibraryIcon className="h-8 w-8 text-primary" />
          My Library
        </h1>
        <p className="text-muted-foreground mt-1">
          Organize your reading collection.
        </p>
      </div>

      <Tabs defaultValue="reading">
        <TabsList>
          {shelves.map((s) => (
            <TabsTrigger
              key={s.key}
              value={s.key}
              className="flex items-center gap-1"
            >
              <s.icon className="h-4 w-4" />
              {s.label}
              <Badge
                variant="secondary"
                className="ml-1 text-xs"
              >
                {
                  (library || []).filter(
                    (l) => l.shelf === s.key
                  ).length
                }
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {shelves.map((shelf) => (
          <TabsContent
            key={shelf.key}
            value={shelf.key}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {(library || [])
                .filter((l) => l.shelf === shelf.key)
                .map((item, i) => {
                  const book = books.find(
                    (b) => b.id === item.bookId
                  )
                  if (!book) return null

                  return (
                    <motion.div
                      key={item.bookId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="overflow-hidden">

                        {/* ✅ Image Section */}
                        <div className="h-48 w-full overflow-hidden rounded-t-lg">
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

                        <CardContent className="p-4 space-y-2">
                          <h3 className="font-display font-semibold truncate">
                            {book.title}
                          </h3>

                          <p className="text-sm text-muted-foreground">
                            {book.author}
                          </p>

                          {item.notes && (
                            <p className="text-xs text-muted-foreground italic">
                              "{item.notes}"
                            </p>
                          )}

                          <div className="flex gap-1 flex-wrap">
                            {(item.tags || []).map((t) => (
                              <Badge
                                key={t}
                                variant="outline"
                                className="text-xs"
                              >
                                {t}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-1 mt-2">
                            {shelves
                              .filter(
                                (s) =>
                                  s.key !== shelf.key
                              )
                              .map((s) => (
                                <Button
                                  key={s.key}
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() =>
                                    moveToShelf(
                                      item.bookId,
                                      s.key
                                    )
                                  }
                                >
                                  Move to {s.label}
                                </Button>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}

              {(library || []).filter(
                (l) => l.shelf === shelf.key
              ).length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <shelf.icon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No books in this shelf yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}