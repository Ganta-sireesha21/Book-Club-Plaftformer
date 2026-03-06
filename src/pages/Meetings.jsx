import { useState, useEffect  } from "react"
import { useBookClub } from "@/context/BookClubContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"

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
  DialogDescription,
} from "@/components/ui/dialog"

import { Calendar } from "@/components/ui/calendar"

import { Plus, Users, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

export default function Meetings() {

  const { meetings, books, addMeeting, rsvpMeeting } = useBookClub()

  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)

   useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user)
  })
}, [])

  const [form, setForm] = useState({
    title: "",
    bookId: "",
    time: "19:00",
    duration: "1 hour",
    platform: "zoom",
    link: "",
  })

  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleSubmit = () => {

    if (!form.title || !selectedDate) return

    addMeeting({
      title: form.title,
      bookId: form.bookId || undefined,
      date: selectedDate,
      time: form.time,
      duration: form.duration,
      platform: form.platform,
      link: form.link,
      createdBy: "You",
    })

    setOpen(false)

    setForm({
      title: "",
      bookId: "",
      time: "19:00",
      duration: "1 hour",
      platform: "zoom",
      link: "",
    })
  }

  const meetingDates = meetings.map((m) => new Date(m.date))

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">

        <div>
          <h1 className="font-display text-3xl font-bold">
            Virtual Meetings
          </h1>

          <p className="text-muted-foreground mt-1">
            Schedule and join book club meetings.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>

          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Schedule Meeting
            </Button>
          </DialogTrigger>

          <DialogContent>

            <DialogHeader>
              <DialogTitle className="font-display">
                Schedule a Meeting
              </DialogTitle>
            </DialogHeader>

            <DialogDescription>
              Fill in the details to schedule a new meeting.
            </DialogDescription>

            <div className="space-y-3">

              <Input
                placeholder="Meeting Title"
                value={form.title || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    title: e.target.value,
                  }))
                }
              />

              <Input
                placeholder="Meeting Link (https://...)"
                value={form.link || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    link: e.target.value,
                  }))
                }
              />

              <Select
                value={form.bookId}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    bookId: v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Related book (optional)" />
                </SelectTrigger>

                <SelectContent>
                  {books.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.title}
                    </SelectItem>
                  ))}
                </SelectContent>

              </Select>

              <div className="flex gap-2">

                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      time: e.target.value,
                    }))
                  }
                />

                <Input
                  placeholder="Duration"
                  value={form.duration}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      duration: e.target.value,
                    }))
                  }
                />

              </div>

              <Select
                value={form.platform}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    platform: v,
                  }))
                }
              >

                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="google-meet">Google Meet</SelectItem>
                </SelectContent>

              </Select>

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border mx-auto"
              />

              <Button onClick={handleSubmit} className="w-full">
                Schedule
              </Button>

            </div>

          </DialogContent>

        </Dialog>
      </div>


      {/* Calendar + Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        <div className="lg:col-span-2">

          <Card>
            <CardContent className="p-4">

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ meeting: meetingDates }}
                modifiersStyles={{
                  meeting: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="mx-auto"
              />

            </CardContent>
          </Card>

        </div>


        {/* Meetings list */}
        <div className="lg:col-span-3 space-y-4">

          {meetings.map((m, i) => {

            const book = books.find((b) => b.id === m.bookId)

            const isRsvpd = (m.rsvps || []).includes(user?.id)

            return (

              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >

                <Card>

                  <CardContent className="p-4">

                    <div className="flex items-start justify-between gap-4">

                      <div className="space-y-1">

                        <h3 className="font-display font-semibold">
                          {m.title}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {new Date(m.date).toLocaleDateString()} at {m.time} · {m.duration}
                        </p>

                        {book && (
                          <Badge variant="secondary">
                            {book.title}
                          </Badge>
                        )}

                        <div className="flex items-center gap-1 mt-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {(m.rsvps || []).length} attending
                          </span>
                        </div>

                      </div>


                      <div className="flex flex-col gap-2 shrink-0">

                        <Button
                          variant={isRsvpd ? "default" : "outline"}
                          size="sm"
                          onClick={() => rsvpMeeting(m.id)}
                        >
                          {isRsvpd ? "Going ✓" : "RSVP"}
                        </Button>

                        <a
                          href={m.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            {m.platform === "zoom" ? "Zoom" : "Meet"}
                          </Button>
                        </a>

                      </div>

                    </div>

                  </CardContent>

                </Card>

              </motion.div>

            )
          })}

        </div>

      </div>

    </div>
  )
}