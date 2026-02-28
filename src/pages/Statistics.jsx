import { useBookClub } from "@/context/BookClubContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Star, Target } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

export default function Statistics() {
  const { books, discussions, progress } = useBookClub()

  const totalBooks = books.length
  const totalReviews = books.reduce((a, b) => a + b.reviews.length, 0)
  const totalDiscussions = discussions.length
  const totalReplies = discussions.reduce(
    (a, d) => a + d.replies.length,
    0
  )

  const booksCompleted = progress.filter(
    (p) => p.pagesRead >= p.totalPages
  ).length

  const allRatings = books.flatMap((b) => b.ratings)

  const avgRating = allRatings.length
    ? (
        allRatings.reduce((a, r) => a + r.value, 0) /
        allRatings.length
      ).toFixed(1)
    : "0.0"

  const genreData = books.reduce((acc, b) => {
    const existing = acc.find((g) => g.name === b.genre)
    if (existing) existing.value++
    else acc.push({ name: b.genre, value: 1 })
    return acc
  }, [])

  const stats = [
    { label: "Books Suggested", value: totalBooks, icon: BookOpen },
    { label: "Books Completed", value: booksCompleted, icon: Target },
    { label: "Reviews Written", value: totalReviews, icon: Star },
    { label: "Discussions", value: totalDiscussions, icon: MessageSquare },
    { label: "Total Replies", value: totalReplies, icon: MessageSquare },
    { label: "Avg Rating", value: avgRating, icon: Star },
  ]

  return (
    <div className="space-y-8 p-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="text-muted-foreground text-sm">
          Club-wide stats and performance insights.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <Card
            key={i}
            className="rounded-xl shadow-sm hover:shadow-md transition"
          >
            <CardContent className="p-5 text-center">
              <s.icon className="mx-auto mb-3 h-6 w-6 text-purple-600" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {s.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Breakdown */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Genre Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) =>
                    `${name} (${value})`
                  }
                >
                  {genreData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={[
                        "#7c3aed",
                        "#06b6d4",
                        "#f97316",
                        "#ec4899",
                        "#22c55e",
                      ][index % 5]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Popular Books */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Most Popular Books</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...books]
                  .sort((a, b) => b.votes - a.votes)
                  .slice(0, 5)
                  .map((b) => ({
                    name: b.title.slice(0, 12),
                    votes: b.votes,
                  }))}
              >
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="votes"
                  fill="#7c3aed"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}