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
import {
  MessageSquare,
  Plus,
  Heart,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { motion } from "framer-motion"

export default function Discussions() {
  const {
    discussions,
    books,
    addDiscussion,
    addReply,
    likeReply,
  } = useBookClub()

  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [replyText, setReplyText] = useState({})
  const [form, setForm] = useState({
    bookId: "",
    title: "",
    chapter: "",
    content: "",
  })

  const filtered = discussions.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = () => {
    if (!form.title || !form.content || !form.bookId) return

    addDiscussion({
      bookId: form.bookId,
      title: form.title,
      chapter: form.chapter,
      content: form.content,
      author: "You",
    })

    setForm({
      bookId: "",
      title: "",
      chapter: "",
      content: "",
    })

    setOpen(false)
  }

  const handleReply = (discussionId) => {
    const text = replyText[discussionId]
    if (!text?.trim()) return

    addReply(discussionId, {
      author: "You",
      content: text,
    })

    setReplyText((prev) => ({
      ...prev,
      [discussionId]: "",
    }))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Discussion Forums
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore book-specific discussions and share your thoughts.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              New Discussion
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">
                Start a Discussion
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Select
                value={form.bookId}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, bookId: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a book" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Discussion title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    title: e.target.value,
                  }))
                }
              />

              <Input
                placeholder="Chapter (optional)"
                value={form.chapter}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    chapter: e.target.value,
                  }))
                }
              />

              <Textarea
                placeholder="Start the conversation..."
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    content: e.target.value,
                  }))
                }
              />

              <Button
                onClick={handleSubmit}
                className="w-full"
              >
                Post Discussion
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search discussions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((d, i) => {
          const book = books.find(
            (b) => b.id === d.bookId
          )
          const isExpanded = expandedId === d.id

          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardHeader
                  className="cursor-pointer pb-3"
                  onClick={() =>
                    setExpandedId(
                      isExpanded ? null : d.id
                    )
                  }
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-display text-lg">
                        {d.title}
                      </CardTitle>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {book && (
                          <Badge variant="secondary">
                            {book.title}
                          </Badge>
                        )}

                        {d.chapter && (
                          <Badge variant="outline">
                            {d.chapter}
                          </Badge>
                        )}

                        <span className="text-xs text-muted-foreground">
                          by {d.author} ·{" "}
                          {new Date(
                            d.createdAt || d.date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <MessageSquare className="h-3 w-3" />
                        {(d.replies || []).length}
                      </Badge>

                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    <p className="text-sm border-l-2 border-primary pl-4 py-2 bg-muted/50 rounded-r-lg">
                      {d.content}
                    </p>

                    {(d.replies || []).map((r) => (
                      <div
                        key={r.id}
                        className="ml-4 pl-4 border-l border-border"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {(r.author || "U")[0]}
                          </div>
                          <span className="text-sm font-medium">
                            {r.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              r.date
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-sm ml-8">
                          {r.content || r.text}
                        </p>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-6 mt-1"
                          onClick={() =>
                            likeReply(
                              d.id,
                              r.id,
                              "You"
                            )
                          }
                        >
                          <Heart
                            className={`h-3 w-3 mr-1 ${
                              (r.likedBy || []).includes("You")
                                ? "fill-primary text-primary"
                                : ""
                            }`}
                          />
                          <span className="text-xs">
                            {r.likes}
                          </span>
                        </Button>
                      </div>
                    ))}

                    <div className="flex gap-2 ml-4">
                      <Input
                        placeholder="Write a reply..."
                        value={
                          replyText[d.id] || ""
                        }
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [d.id]:
                              e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          handleReply(d.id)
                        }
                      />

                      <Button
                        size="sm"
                        onClick={() =>
                          handleReply(d.id)
                        }
                      >
                        Reply
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}