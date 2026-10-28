import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  BrainCircuit,
  FileText,
  Sparkles,
  Target,
  Timer,
} from 'lucide-react';
import usePageMeta from '../utils/usePageMeta.js';

const features = [
  {
    icon: BookOpenCheck,
    title: 'Learn topic by topic',
    description: 'Break your notes into clear topics and learn each one at your own pace.',
    tone: 'mint',
  },
  {
    icon: Timer,
    title: 'Take a timed test',
    description: 'Put your knowledge to the test and get comfortable working against the clock.',
    tone: 'amber',
  },
  {
    icon: Target,
    title: 'Review weak topics',
    description: 'See what needs more work and focus your next study session where it counts.',
    tone: 'coral',
  },
];

const steps = [
  { number: '01', title: 'Add your notes', description: 'Paste in the material you want to study.' },
  { number: '02', title: 'Build your quiz', description: 'Choose a topic and set up your practice.' },
  { number: '03', title: 'Learn and test', description: 'Study each topic, then try a timed test.' },
  { number: '04', title: 'Get better', description: 'Review your results and revisit tricky topics.' },
];

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  usePageMeta(
    'Learn Topic by Topic, Then Take a Quiz',
    'Paste your notes and QuizForge teaches you each topic step by step. Then test yourself with a practice quiz made just for you.'
  );

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="qf-home">
      <motion.section
        className="qf-hero"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.65, ease: 'easeOut' }}
      >
        <div className="qf-hero-copy">
          <span className="qf-eyebrow"><Sparkles size={15} /> YOUR NOTES, MADE USEFUL</span>
          <h1>Study with a plan.<br /><span>Remember more.</span></h1>
          <p>Turn your notes into a clear study path, practice questions, and progress you can see.</p>
          <motion.div whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }} whileTap={{ scale: 0.97 }}>
            <Link to="/create" className="qf-button">
              Create a Quiz <ArrowUpRight size={18} />
            </Link>
          </motion.div>
          <div className="qf-hero-note">
            <span className="qf-note-mark"><BrainCircuit size={17} /></span>
            <span>One topic at a time. One step closer.</span>
          </div>
        </div>

        <div className="qf-study-preview" aria-hidden="true">
          <div className="qf-preview-topline"><span>STUDY SESSION</span><span className="qf-live-dot" /></div>
          <div className="qf-preview-title"><span className="qf-preview-icon"><FileText size={18} /></span><div><strong>Cell biology</strong><small>4 topics to explore</small></div></div>
          <div className="qf-preview-progress"><span /><span /><span /><span /></div>
          <div className="qf-preview-label">UP NEXT</div>
          <div className="qf-preview-topic"><span className="qf-topic-check"><BookOpenCheck size={16} /></span><span><strong>Cell structure</strong><small>Topic 2 of 4</small></span><ArrowRight size={17} /></div>
          <div className="qf-preview-footer"><span>YOUR PROGRESS</span><strong>2 of 4 topics</strong></div>
        </div>
        <div className="qf-hero-orbit qf-orbit-one" aria-hidden="true" />
        <div className="qf-hero-orbit qf-orbit-two" aria-hidden="true" />
      </motion.section>

      <motion.section
        className="qf-section qf-features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.55, ease: 'easeOut' }}
      >
        <div className="qf-section-heading">
          <span className="qf-eyebrow">A BETTER WAY TO PRACTICE</span>
          <h2>Make every study session count.</h2>
        </div>
        <motion.div
          className="qf-feature-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {features.map(({ icon: Icon, title, description, tone }) => (
            <motion.article
              className={`qf-feature-card qf-tone-${tone}`}
              key={title}
              variants={itemReveal}
              whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.4, ease: 'easeOut' }}
            >
              <span className="qf-feature-icon"><Icon size={21} strokeWidth={1.8} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="qf-feature-arrow"><ArrowUpRight size={17} /></span>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="qf-section qf-how"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.55, ease: 'easeOut' }}
      >
        <div className="qf-section-heading qf-how-heading">
          <span className="qf-eyebrow">SIMPLE FROM THE START</span>
          <h2>How it works</h2>
          <p>Go from notes to a focused study session in four easy steps.</p>
        </div>
        <motion.div
          className="qf-steps"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map(({ number, title, description }) => (
            <motion.article
              className="qf-step"
              key={number}
              variants={itemReveal}
              whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.35, ease: 'easeOut' }}
            >
              <span className="qf-step-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="qf-final-cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, ease: 'easeOut' }}
      >
        <div>
          <span className="qf-eyebrow">READY WHEN YOU ARE</span>
          <h2>Your next good study session starts here.</h2>
        </div>
        <motion.div whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }} whileTap={{ scale: 0.97 }}>
          <Link to="/create" className="qf-button qf-button-light">
            Create a Quiz <ArrowUpRight size={18} />
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}