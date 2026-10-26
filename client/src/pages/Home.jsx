import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  usePageMeta(
    'Learn Topic by Topic, Then Take a Quiz',
    'Paste your notes and QuizForge teaches you each topic step by step. Then test yourself with a practice quiz made just for you.'
  );

  return (
    <main className="qf-home">
      <motion.section
        className="qf-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        <div className="qf-hero-copy">
          <span className="qf-eyebrow"><Sparkles size={15} /> YOUR NOTES, MADE USEFUL</span>
          <h1>Study with a plan.<br /><span>Remember more.</span></h1>
          <p>Turn your notes into a clear study path, practice questions, and progress you can see.</p>
          <Link to="/create" className="qf-button">
            Create a Quiz <ArrowUpRight size={18} />
          </Link>
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
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="qf-section-heading">
          <span className="qf-eyebrow">A BETTER WAY TO PRACTICE</span>
          <h2>Make every study session count.</h2>
        </div>
        <div className="qf-feature-grid">
          {features.map(({ icon: Icon, title, description, tone }, index) => (
            <motion.article
              className={`qf-feature-card qf-tone-${tone}`}
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.1, ease: 'easeOut' }}
            >
              <span className="qf-feature-icon"><Icon size={21} strokeWidth={1.8} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="qf-feature-arrow"><ArrowUpRight size={17} /></span>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="qf-section qf-how"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="qf-section-heading qf-how-heading">
          <span className="qf-eyebrow">SIMPLE FROM THE START</span>
          <h2>How it works</h2>
          <p>Go from notes to a focused study session in four easy steps.</p>
        </div>
        <div className="qf-steps">
          {steps.map(({ number, title, description }, index) => (
            <motion.article
              className="qf-step"
              key={number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.09, ease: 'easeOut' }}
            >
              <span className="qf-step-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="qf-final-cta"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div>
          <span className="qf-eyebrow">READY WHEN YOU ARE</span>
          <h2>Your next good study session starts here.</h2>
        </div>
        <Link to="/create" className="qf-button qf-button-light">
          Create a Quiz <ArrowUpRight size={18} />
        </Link>
      </motion.section>
    </main>
  );
}