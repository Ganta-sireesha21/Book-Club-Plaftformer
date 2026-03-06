import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"

import {
  initialBooks,
  initialDiscussions,
  initialProgress,
  initialGoals,
  initialMeetings,
  initialLibrary,
  initialAchievements,
  initialNotifications,
  initialActivity,
} from "../lib/store"

import { supabase } from "@/integrations/supabase/client"

const BookClubContext = createContext(null)

export function BookClubProvider({ children }) {

  const [books, setBooks] = useState(initialBooks)
  const [discussions, setDiscussions] = useState(initialDiscussions)
  const [progress, setProgress] = useState(initialProgress)
  const [goals, setGoals] = useState(initialGoals)
  const [meetings, setMeetings] = useState(initialMeetings)
  const [library, setLibrary] = useState(initialLibrary)
  const [achievements] = useState(initialAchievements)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activity, setActivity] = useState(initialActivity)
  const [darkMode, setDarkMode] = useState(false)

  /* Load meetings from Supabase */
  useEffect(() => {

    const fetchMeetings = async () => {

      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .order("date", { ascending: true })

      if (error) {
        console.log("Fetch meetings error:", error.message)
        return
      }
      const { data: rsvpData } = await supabase
      .from("meeting_rsvps")
      .select("*")

      const formatted = data.map((m) => ({
        ...m,
        rsvps: rsvpData
        .filter((r) => r.meeting_id === m.id)
        .map((r) => r.user_id),
        time: "19:00",
        duration: "1 hour",
        platform: m.location || "zoom",
        link: m.meeting_link
      }))

      setMeetings(formatted)
    }

    fetchMeetings()

  }, [])

  /* Notifications */
  const addNotification = useCallback((n) => {
    setNotifications((prev) => [
      { ...n, id: `n${Date.now()}`, date: new Date(), read: false },
      ...prev,
    ])
  }, [])

  /* Activity */
  const addActivity = useCallback((a) => {
    setActivity((prev) => [
      { ...a, id: `ac${Date.now()}`, date: new Date() },
      ...prev,
    ])
  }, [])

  /* Add Book */
  const addBook = useCallback(async (book) => {

    const { data, error } = await supabase
      .from("books")
      .insert({
        title: book.title,
        author: book.author,
        description: book.description,
        genre: book.genre,
        pages: book.pages,
        suggested_by_name: book.suggestedBy
      })
      .select()
      .single()

    if (error) {
      console.log("Book error:", error.message)
      return
    }

    const newBook = {
      ...data,
      voters: [],
      ratings: [],
      reviews: [],
    }

    setBooks((prev) => [newBook, ...prev])

    addNotification({
      type: "suggestion",
      message: `${book.suggestedBy} suggested '${book.title}'`,
    })

    addActivity({
      type: "suggestion",
      message: `suggested '${book.title}'`,
      user: book.suggestedBy,
    })

  }, [addNotification, addActivity])

  /* Add Discussion */
  const addDiscussion = useCallback(async (data) => {

    const { data: newDiscussion, error } = await supabase
      .from("discussions")
      .insert({
        title: data.title,
        content: data.content,
        book_id: data.bookId,
        author_name: data.author
      })
      .select()
      .single()

    if (error) {
      console.log("Discussion error:", error.message)
      return
    }

    setDiscussions((prev) => [
      { ...newDiscussion, replies: [] },
      ...prev
    ])

    addActivity({
      type: "discussion",
      message: `started a discussion on '${data.title}'`,
      user: data.author,
    })

    addNotification({
      type: "discussion",
      message: `New discussion: ${data.title}`,
    })

  }, [addActivity, addNotification])

  /* Add Meeting (RLS FIX) */
  const addMeeting = useCallback(async (meeting) => {

    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("meetings")
      .insert({
        title: meeting.title,
        date: meeting.date,
        location: meeting.platform,
        meeting_link: meeting.link,
        created_by: user.id,
        created_by_name: user.email
      })
      .select()
      .single()

    if (error) {
      console.log("Meeting error:", error.message)
      return
    }

    const newMeeting = {
      ...data,
      rsvps: [],
      time: meeting.time,
      duration: meeting.duration,
      platform: meeting.platform,
      link: meeting.link
    }

    setMeetings((prev) => [newMeeting, ...prev])

    addNotification({
      type: "meeting",
      message: `New meeting scheduled: ${meeting.title}`,
    })

    addActivity({
      type: "meeting",
      message: `scheduled a meeting`,
      user: "You",
    })

  }, [addNotification, addActivity])

  /* RSVP Meeting */
  const rsvpMeeting = useCallback(async (meetingId) => {

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const { data: existing } = await supabase
    .from("meeting_rsvps")
    .select("*")
    .eq("meeting_id", meetingId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) {

    await supabase
      .from("meeting_rsvps")
      .delete()
      .eq("meeting_id", meetingId)
      .eq("user_id", user.id)

  } else {

    await supabase
      .from("meeting_rsvps")
      .insert({
        meeting_id: meetingId,
        user_id: user.id
      })

  }

  // reload RSVP data
  const { data: rsvpData } = await supabase
    .from("meeting_rsvps")
    .select("*")

  setMeetings((prev) =>
    prev.map((m) => ({
      ...m,
      rsvps: rsvpData
        .filter((r) => r.meeting_id === m.id)
        .map((r) => r.user_id)
    }))
  )

}, [])

  /* Dark Mode */
  const toggleDarkMode = useCallback(() => {

    setDarkMode((prev) => {

      const next = !prev
      document.documentElement.classList.toggle("dark", next)

      return next
    })

  }, [])

  return (
    <BookClubContext.Provider
      value={{
        books,
        discussions,
        progress,
        goals,
        meetings,
        rsvpMeeting,
        library,
        achievements,
        notifications,
        activity,
        darkMode,
        addBook,
        toggleDarkMode,
        addNotification,
        addDiscussion,
        addMeeting,
      }}
    >
      {children}
    </BookClubContext.Provider>
  )
}

export function useBookClub() {

  const ctx = useContext(BookClubContext)

  if (!ctx) {
    throw new Error(
      "useBookClub must be used within BookClubProvider"
    )
  }

  return ctx
}