import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, LayoutGrid, ListTodo, Sparkles } from "lucide-react";
import { NavLink } from "react-router";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* <img src="" loading="lazy" alt="" /> */}
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Manage Tasks.
          <span className="block text-primary">Like a Pro.</span>
        </h1>

        <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg">
          Organize your work into boards, lists, and cards. Stay productive with
          a Trello-inspired task management experience.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <NavLink to={"/signup"}>
            <Button className={"cursor-pointer"} size="lg">
              Get Started Free
            </Button>
          </NavLink>
          <NavLink to={"/login"}>
            <Button className={"cursor-pointer"} size="lg" variant="outline">
              Login
            </Button>
          </NavLink>
        </div>
      </motion.div>
    </section>
  );
}

const features = [
  {
    icon: LayoutGrid,
    title: "Boards",
    desc: "Create boards for projects and teams",
  },
  {
    icon: ListTodo,
    title: "Lists",
    desc: "Organize tasks by progress",
  },
  {
    icon: CheckCircle,
    title: "Cards",
    desc: "Track every task with clarity",
  },
];

function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/40">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-14">
          Simple. Powerful. Flexible.
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <f.icon className="mx-auto h-10 w-10 text-primary" />
                  <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section className="py-28">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold">Your workflow, visualized</h2>
          <p className="mt-4 text-muted-foreground">
            Drag cards across lists like
            <strong> Todo → In Progress → Done</strong>. Focus on what matters.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-muted rounded-xl p-6 shadow"
        >
          <div className="grid grid-cols-3 gap-4">
            {["Todo", "Doing", "Done"].map((col) => (
              <div key={col} className="bg-background rounded-lg p-4">
                <p className="font-medium mb-3">{col}</p>
                <div className="space-y-2">
                  <div className="h-8 rounded bg-muted" />
                  <div className="h-8 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="py-24 bg-muted/40">
      <div className="container mx-auto px-6 text-center">
        <Sparkles className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 text-3xl font-bold">Built for productivity</h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Minimal UI, fast performance, and smooth animations help you stay
          focused on work—not tools.
        </p>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-28 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold">Start organizing today</h2>
        <p className="mt-4 text-muted-foreground">
          Free forever. No credit card required.
        </p>
        <Button size="lg" className="mt-8">
          Create Your First Board
        </Button>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      © 2026 TaskFlow. All rights reserved.
    </footer>
  );
}
