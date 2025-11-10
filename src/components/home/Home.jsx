import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Video,
  Brain,
  Users,
  ShieldCheck,
  HeartHandshake,
  Globe,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-white text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from--white to-blue-50">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-24 gap-12">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-blue-900">
              Bridging Learning With{" "}
              <span className="text-yellow-500">Sign Recognition</span>
            </h1>
            <p className="text-gray-600 mt-6 text-lg leading-relaxed">
              A fun and inclusive space to explore and practice American Sign
              Language using AI-powered recognition and real-time learning
              support.
            </p>
            <div className="mt-10 flex gap-4">
              <Link to="/detect">
                <button className="bg-blue-900 hover:bg-blue-950 text-white px-8 py-3 rounded-full font-medium shadow-lg transition">
                  Try It Now
                </button>
              </Link>
              <Link to="/learning">
                <button className="border border-blue-800 hover:bg-blue-50 text-blue-800 px-8 py-3 rounded-full font-medium transition">
                  Learn More
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:w-1/2 flex justify-center"
          >
            <img
              src="asl2.png"
              alt="ASL detection illustration"
              className="rounded-2xl shadow-lg w-full md:w-4/5"
            />
          </motion.div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section
        id="features"
        className="px-8 md:px-20 py-24 bg-white text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-blue-900"
        >
          Why Choose Sign Lab?
        </motion.h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Our platform blends technology, accessibility, and empathy — designed
          to make learning and practicing sign language simple, interactive, and
          inclusive.
        </p>

        <div className="grid md:grid-cols-4 gap-10 mt-16">
          {[
            {
              icon: <Video className="text-yellow-500 w-10 h-10" />,
              title: "Interactive Learning",
              desc: "Engage with lessons in real-time through live video, powered by CNN and Mediapipe models.",
            },
            {
              icon: <Brain className="text-yellow-500 w-10 h-10" />,
              title: "Adaptive Intelligence",
              desc: "Our AI personalizes learning, understanding each student’s pace and style to optimize growth.",
            },
            {
              icon: <Users className="text-yellow-500 w-10 h-10" />,
              title: "Inclusive Education",
              desc: "Designed to support learners of all abilities and backgrounds — accessible to everyone.",
            },
            {
              icon: <ShieldCheck className="text-yellow-500 w-10 h-10" />,
              title: "Privacy First",
              desc: "Your progress and interactions are secure — no personal data is stored without consent.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="p-8 bg-blue-50 rounded-2xl hover:bg-yellow-50 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-yellow-50 via-white to-blue-50 py-24 px-8 md:px-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-blue-900"
        >
          How It Works
        </motion.h2>
        <div className="mt-12 grid md:grid-cols-3 gap-12">
          {[
            {
              step: "1",
              title: "Capture",
              desc: "Position your hands in front of the camera — the system starts detecting your sign gestures in real time.",
            },
            {
              step: "2",
              title: "Practice",
              desc: "Watch how the AI recognizes your signs and provides instant visual feedback to help you perfect each gesture.",
            },
            {
              step: "3",
              title: "Improve",
              desc: "Refine your skills through continuous practice and feedback, tracking your progress as you master more signs.",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-white shadow-md rounded-2xl p-8 border-t-4 border-yellow-400"
            >
              <div className="text-3xl font-bold text-blue-800 mb-2">
                {s.step}
              </div>
              <h3 className="text-xl font-semibold text-blue-900">{s.title}</h3>
              <p className="text-gray-600 mt-2">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Who It Helps Section */}
      <section className="py-24 px-8 md:px-20 bg-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-blue-900"
        >
          Who It Helps
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-10 mt-16">
          {[
            {
              icon: <HeartHandshake className="text-yellow-500 w-10 h-10" />,
              title: "Learners & Enthusiasts",
              desc: "Discover an engaging way to learn and practice American Sign Language with instant, AI-powered feedback.",
            },
            {
              icon: <Globe className="text-yellow-500 w-10 h-10" />,
              title: "Teachers & Educators",
              desc: "Empower students through interactive lessons and real-time gesture recognition tools designed for effective ASL teaching.",
            },
            {
              icon: <Star className="text-yellow-500 w-10 h-10" />,
              title: "Inclusive Communities",
              desc: "Promote accessibility and awareness by creating spaces where everyone can learn and appreciate sign language together.",
            },
          ].map((group, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="p-8 bg-blue-50 rounded-2xl hover:bg-yellow-50 shadow-sm transition"
            >
              <div className="flex justify-center mb-4">{group.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900">
                {group.title}
              </h3>
              <p className="text-gray-600 text-sm">{group.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission / CTA Section */}
      <section className="rounded-2xl text-black text-center py-24 px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold"
        >
          Our Mission
        </motion.h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-black">
          To make learning universal, inclusive, and empowering through
          technology that adapts, guides, and understands — supporting every
          learner, regardless of language or ability.
        </p>
        <button className="mt-10 bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-10 py-4 rounded-full font-semibold shadow-lg transition">
          Get Involved
        </button>
      </section>
    </div>
  );
};

export default Home;
