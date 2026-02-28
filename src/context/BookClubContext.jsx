import React, {
  createContext,
  useContext,
  useState,
  useCallback,
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

  /* 🔔 Notifications */
  const addNotification = useCallback((n) => {
    setNotifications((prev) => [
      { ...n, id: `n${Date.now()}`, date: new Date(), read: false },
      ...prev,
    ])
  }, [])

  /* 📊 Activity */
  const addActivity = useCallback((a) => {
    setActivity((prev) => [
      { ...a, id: `ac${Date.now()}`, date: new Date() },
      ...prev,
    ])
  }, [])

  /* 📚 Add Book */
  const addBook = useCallback(
    (book) => {
      const newBook = {
        ...book,
        id: `b${Date.now()}`,
        votes: 0,
        voters: [],
        ratings: [],
        reviews: [],
        suggestedAt: new Date(),
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
    },
    [addNotification, addActivity]
  )

  /* 🗳 Vote */
  const voteBook = useCallback((bookId, userId) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b

        if (b.voters.includes(userId)) {
          return {
            ...b,
            votes: b.votes - 1,
            voters: b.voters.filter((v) => v !== userId),
          }
        }

        return {
          ...b,
          votes: b.votes + 1,
          voters: [...b.voters, userId],
        }
      })
    )
  }, [])

  /* 💬 Add Discussion */
  const addDiscussion = useCallback(
    (data) => {
      const newDiscussion = {
        id: `d${Date.now()}`,
        ...data,
        date: new Date(),
        replies: [],
      }

      setDiscussions((prev) => [newDiscussion, ...prev])

      addActivity({
        type: "discussion",
        message: `started a discussion on '${data.title}'`,
        user: data.author,
      })

      addNotification({
        type: "discussion",
        message: `New discussion: ${data.title}`,
      })
    },
    [addActivity, addNotification]
  )

  /* 💬 Add Reply */
  const addReply = useCallback((discussionId, reply) => {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussionId
          ? {
              ...d,
              replies: [
                ...(d.replies || []),
                {
                  id: `r${Date.now()}`,
                  ...reply,
                  date: new Date(),
                  likes: 0,
                  likedBy: [],
                },
              ],
            }
          : d
      )
    )
  }, [])

  /* ❤️ Like Reply */
  const likeReply = useCallback((discussionId, replyId, user) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== discussionId) return d

        return {
          ...d,
          replies: ( d.replies || []).map((r) => {
            if (r.id !== replyId) return r

            const likedBy = r.likedBy || []
          const likes = r.likes || 0
          const alreadyLiked = likedBy.includes(user)

            return {
              ...r,
              likedBy: alreadyLiked
              ? likedBy.filter((u) => u !== user)
              : [...likedBy, user],
            likes: alreadyLiked ? likes - 1 : likes + 1,
            }
          }),
        }
      })
    )
  }, [])

  /* 📖 UPDATE PROGRESS (🔥 FIX ADDED) */
  const updateProgress = useCallback(
    (bookId, pagesRead) => {
      setProgress((prev) => {
        const existing = prev.find(
          (p) => p.bookId === bookId && p.userId === "You"
        )

        if (existing) {
          return prev.map((p) =>
            p.bookId === bookId && p.userId === "You"
              ? { ...p, pagesRead }
              : p
          )
        }

        return [
          ...prev,
          { bookId, userId: "You", pagesRead },
        ]
      })

      addActivity({
        type: "progress",
        message: "updated reading progress",
        user: "You",
      })

      addNotification({
        type: "progress",
        message: "Reading progress updated",
      })
    },
    [addActivity, addNotification]
  )

  const updateGoalProgress = useCallback((goalId, value) => {
  setGoals((prev) =>
    prev.map((g) =>
      g.id === goalId
        ? {
            ...g,
            progress: Math.min(value, g.target),
          }
        : g
    )
  )

  addActivity({
    type: "goal",
    message: "updated goal progress",
    user: "You",
  })

  addNotification({
    type: "goal",
    message: "Goal progress updated",
  })
}, [addActivity, addNotification])

const addGoal = useCallback((goal) => {
  const newGoal = {
    id: `g${Date.now()}`,
    ...goal,
    progress: 0,
    createdAt: new Date(),
  }

  setGoals((prev) => [newGoal, ...prev])

  addActivity({
    type: "goal",
    message: `created a new goal`,
    user: "You",
  })

  addNotification({
    type: "goal",
    message: `New goal added`,
  })
}, [addActivity, addNotification])



const addReview = useCallback(
  (reviewData) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id !== reviewData.bookId) return book

        return {
          ...book,
          reviews: [
            ...book.reviews,
            {
              id: `rev${Date.now()}`,
              userId: reviewData.userId,
              userName: reviewData.userName,
              rating: reviewData.rating,
              text: reviewData.text,
              date: new Date(),
              likes: 0,
              likedBy: [],
            },
          ],
          ratings: [
            ...book.ratings,
            { value: reviewData.rating },
          ],
        }
      })
    )

  
    addActivity({
      type: "review",
      message: `reviewed a book`,
      user: reviewData.userName,   // ← correct
    })

    addNotification({
      type: "review",
      message: `${reviewData.userName} added a review`,
    })
  },
  [addActivity, addNotification]
)



const addToLibrary = useCallback((bookId, shelf = "to-read") => {
  setLibrary((prev) => {
    const exists = prev.find(
      (item) => item.bookId === bookId
    )

    if (exists) return prev

    return [
      ...prev,
      {
        id: `lib${Date.now()}`,
        bookId,
        shelf,
        userId: "You",
        notes: "",     
        tags: [],  
        addedAt: new Date(),
      },
    ]
  })

  addNotification({
    type: "library",
    message: "Book added to your library",
  })

  addActivity({
    type: "library",
    message: "added a book to library",
    user: "You",
  })
}, [addNotification, addActivity])
const moveToShelf = useCallback((bookId, newShelf) => {
  setLibrary((prev) =>
    prev.map((item) =>
      item.bookId === bookId
        ? { ...item, shelf: newShelf }
        : item
    )
  )
}, [])


const addMeeting = useCallback((meeting) => {
  const newMeeting = {
    id: `m${Date.now()}`,
     rsvps: [], 
    ...meeting,
    createdAt: new Date(),
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
    


  /* 🌙 Dark Mode */
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
        library,
        achievements,
        notifications,
        activity,
        darkMode,
        addBook,
        voteBook,
        toggleDarkMode,
        addNotification,
        addDiscussion,
        addReply,
        likeReply,
        updateProgress, 
        updateGoalProgress,
        addGoal,
        addReview,
        addToLibrary,
        addMeeting,
        moveToShelf, 
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