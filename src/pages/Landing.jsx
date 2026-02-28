import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Users, Target, Star, MessageSquare, BarChart3, ArrowRight, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: BookOpen, title: "Book Suggestions", description: "Vote on what the club reads next" },
  { icon: MessageSquare, title: "Discussions", description: "Dive deep into every chapter" },
  { icon: Target, title: "Reading Goals", description: "Track and hit your yearly targets" },
  { icon: Star, title: "Reviews", description: "Share your honest opinions" },
  { icon: BarChart3, title: "Progress Tracking", description: "See how far you've come" },
  { icon: Users, title: "Meetings", description: "Schedule and RSVP to club meetups" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6ec] to-[#f8efe3] overflow-hidden">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <BookMarked className="h-6 w-6" />
          <span className="font-display">BookClub</span>
        </div>
        <Button variant="ghost" onClick={() => navigate("/auth")}>
          Sign In <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 pt-20">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <BookOpen className="h-4 w-4" />
            Your reading community
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Read together.{" "}
            <span className="text-primary">Grow together.</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            A beautifully crafted space for book clubs to suggest reads, track progress, share reviews, and connect over great literature.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="px-8 py-6 text-base font-semibold shadow-lg shadow-primary/30"
              onClick={() => navigate("/auth")}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </div>
        </motion.div>

        {/* Floating book cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 mt-20 w-full max-w-2xl"
        >
          <div className="grid grid-cols-3 gap-4">
            {[
              { title: "Dune", author: "Frank Herbert", color: "from-amber-500/20 to-orange-500/20" },
              { title: "1984", author: "George Orwell", color: "from-primary/20 to-purple-500/20" },
              { title: "Sapiens", author: "Yuval Noah Harari", color: "from-emerald-500/20 to-teal-500/20" },
            ].map((book, i) => (
              <motion.div
                key={book.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className={`rounded-xl p-4 bg-gradient-to-br ${book.color} border border-border backdrop-blur-sm`}
              >
                <div className="h-20 rounded-lg bg-card/50 flex items-center justify-center mb-3">
                  <BookOpen className="h-8 w-8 text-primary/60" />
                </div>
                <p className="font-display font-semibold text-sm text-foreground truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-2.5 w-2.5 fill-accent text-accent" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything your book club needs
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            One platform to manage your entire reading community experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/20"
        >
          <BookMarked className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Ready to start reading?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join your book club today and never miss a great read.
          </p>
          <Button
            size="lg"
            className="px-10 py-6 text-base font-semibold shadow-lg shadow-primary/30"
            onClick={() => navigate("/auth")}
          >
            Join Now — It's Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-muted-foreground text-sm">
        <div className="flex items-center justify-center gap-2 mb-2 text-primary font-semibold">
          <BookMarked className="h-4 w-4" />
          <span className="font-display">BookClub</span>
        </div>
        <p>Your reading community awaits.</p>
      </footer>
    </div>
  );
}
