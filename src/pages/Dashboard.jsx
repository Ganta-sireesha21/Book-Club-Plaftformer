import { useBookClub } from "../context/BookClubContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageSquare, Calendar, Star,TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/context/AuthContext";

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

export default function Dashboard() {
  const { profile } = useAuth();
  const {
    books,
    discussions,
    progress,
    activity,
    meetings,
    goals,
    achievements,
  } = useBookClub()

  const topBooks = [...books]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5)

  const chartData = topBooks.map((b) => ({
    name:
      b.title.length > 15
        ? b.title.slice(0, 15) + "…"
        : b.title,
    votes: b.votes,
  }))

  const totalReviews = books.reduce(
    (acc, b) => acc + b.reviews.length,
    0
  )

  // ✅ Safe avg rating
  const allRatings = books.flatMap((b) => b.ratings)
  const avgRating = allRatings.length
    ? (
        allRatings.reduce((acc, r) => acc + r.value, 0) /
        allRatings.length
      ).toFixed(1)
    : "0.0"

  const booksRead = progress.filter(
    (p) => p.pagesRead >= p.totalPages
  ).length

  const earnedBadges = achievements.filter(
    (a) => a.earnedAt
  ).length

  const currentGoal = goals[0]

  return (
    <div className="space-y-6 max-w-7xl">
      <motion.div {...fade}>
        <h1 className="font-display text-3xl font-bold">
          Welcome {profile?.display_name || "Reader"} 📖
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening in your book club.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Books Suggested",
            value: books.length,
            icon: BookOpen,
            color: "text-primary",
          },
          {
            label: "Discussions",
            value: discussions.length,
            icon: MessageSquare,
            color: "text-chart-3",
          },
          {
            label: "Reviews",
            value: totalReviews,
            icon: Star,
            color: "text-primary",
          },
          {
            label: "Avg Rating",
            value: avgRating + " ★",
            icon: TrendingUp,
            color: "text-chart-4",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fade}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg bg-muted ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold font-display">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart + Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          {...fade}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-display">
                Top Book Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="votes"
                    fill="var(--color-primary)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          {...fade}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-display">
                Reading Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentGoal && (
                <>
                  <div className="text-center">
                    <p className="text-4xl font-bold font-display text-primary">
                      {currentGoal.current}/
                      {currentGoal.target}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentGoal.type === "books"
                        ? "books"
                        : "pages"}{" "}
                      this year
                    </p>
                  </div>
                  <Progress
                    value={
                      (currentGoal.current /
                        currentGoal.target) *
                      100
                    }
                    className="h-3"
                  />
                </>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Books completed
                </span>
                <Badge variant="secondary">
                  {booksRead}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Badges earned
                </span>
                <Badge variant="secondary">
                  {earnedBadges}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity + Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...fade} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="font-display">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activity.slice(0, 6).map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                      {a.user[0]}
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">
                          {a.user}
                        </span>{" "}
                        {a.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fade} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {meetings.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg border bg-muted/50"
                  >
                    <p className="font-medium text-sm">
                      {m.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(m.date).toLocaleDateString()} at{" "}
                      {m.time} · {m.rsvps.length} attending
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
