import { useState } from "react"
import { useBookClub } from "@/context/BookClubContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Target, Plus } from "lucide-react"
import { motion } from "framer-motion"

export default function Goals() {
  const { goals, addGoal, updateGoalProgress } = useBookClub()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    type: "books",
    target: "",
    startDate: "",
    endDate: "",
  })

  const handleSubmit = () => {
    if (!form.target) return

    addGoal({
      type: form.type,
      target: parseInt(form.target),
      startDate: form.startDate
        ? new Date(form.startDate)
        : new Date(),
      endDate: form.endDate
        ? new Date(form.endDate)
        : new Date(new Date().getFullYear(), 11, 31),
    })

    setOpen(false)
    setForm({
      type: "books",
      target: "",
      startDate: "",
      endDate: "",
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Reading Goals
          </h1>
          <p className="text-muted-foreground mt-1">
            Set and track your personal reading targets.
          </p>
        </div>

        {/* Create Goal Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              New Goal
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">
                Set a Reading Goal
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, type: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="books">
                    Number of Books
                  </SelectItem>
                  <SelectItem value="pages">
                    Number of Pages
                  </SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Target"
                type="number"
                value={form.target}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    target: e.target.value,
                  }))
                }
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      startDate: e.target.value,
                    }))
                  }
                />
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>
              No goals set yet. Create your first reading goal!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal, i) => {
          const progress = goal.progress || 0
          const target = goal.target || 1

          const pct =
            target > 0
              ? Math.min(
                  100,
                  Math.round((progress / target) * 100)
                )
              : 0

          const completed = pct >= 100

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={completed ? "border-green-500/50" : ""}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Target
                      className={`h-5 w-5 ${
                        completed
                          ? "text-green-500"
                          : "text-primary"
                      }`}
                    />
                    {goal.type === "books"
                      ? "Books Goal"
                      : "Pages Goal"}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold font-display">
                      {pct}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {progress}/{target}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    {new Date(goal.startDate).toLocaleDateString()}{" "}
                    —{" "}
                    {new Date(goal.endDate).toLocaleDateString()}
                  </div>

                  {!completed && (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Update progress"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = parseInt(e.target.value)
                            if (!isNaN(val)) {
                              updateGoalProgress(goal.id, val)
                              e.target.value = ""
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={(e) => {
                          const input =
                            e.currentTarget.previousElementSibling
                          const val = parseInt(input.value)
                          if (!isNaN(val)) {
                            updateGoalProgress(goal.id, val)
                            input.value = ""
                          }
                        }}
                      >
                        Set
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}