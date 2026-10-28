import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Asterisk, BookOpenCheck, Target, Timer } from 'lucide-react';
import usePageMeta from '../utils/usePageMeta.js';

const features = [
  {
    number: '01',
    icon: BookOpenCheck,
    title: 'Learn topic by topic',
    description: 'Break your notes into clear topics and learn each one at your own pace.',
  },
  {
    number: '02',
    icon: Timer,
    title: 'Timed test',
    description: 'Put your knowledge to the test and get comfortable working against the clock.',
  },
  {
    number: '03',
    icon: Target,
    title: 'Weak topic review',
    description: 'See what needs more work and focus your next study session where it counts.',
  },
];

const steps = [
  { number: '01', title: 'Add your notes', description: 'Paste in the material you want to study.' },
  { number: '02', title: 'Build your quiz', description: 'Choose a topic and set up your practice.' },
  { number: '03', title: 'Learn and test', description: 'Study each topic, then try a timed test.' },
  { number: '04', title: 'Get better', description: 'Review your results and revisit tricky topics.' },
];

function RedStar({ className = '' }) {
  return <Asterisk className={`qf-ed-star ${className}`} aria-hidden="true" strokeWidth={2.5} />;
}

export default function Home() {
  usePageMeta(
    'Learn Topic by Topic, Then Take a Quiz',
    'Paste your notes and QuizForge teaches you each topic step by step. Then test yourself with a practice quiz made just for you.'
  );

  return (
    <main className="qf-home qf-editorial">
      <section className="qf-ed-hero" aria-labelledby="qf-home-title">
        <div className="qf-ed-corners">
          <span>LEARN</span>
          <span>QUIZFORGE / 001</span>
          <span>TEST</span>
        </div>
        <div className="qf-ed-word-wrap">
          <h1 id="qf-home-title" className="qf-ed-word">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            >
              QUIZFORGE
            </motion.span>
          </h1>
        </div>
        <motion.div
          className="qf-ed-hero-bottom"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
        >
          <RedStar />
          <p>Learn first.<br />Then test yourself.</p>
          <Link to="/create" className="qf-ed-round-link">
            <span>Create a Quiz</span>
            <ArrowUpRight size={22} strokeWidth={1.8} />
          </Link>
        </motion.div>
        <div className="qf-ed-hero-footnote">
          <span>YOUR NOTES, WITH A GAME PLAN</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      <div className="qf-ed-marquee" aria-label="Learn, test, improve">
        <div className="qf-ed-marquee-track" aria-hidden="true">
          <span>LEARN <b>✳</b> TEST <b>✳</b> IMPROVE <b>✳</b>&nbsp;</span>
          <span>LEARN <b>✳</b> TEST <b>✳</b> IMPROVE <b>✳</b>&nbsp;</span>
        </div>
      </div>

      <motion.section
        className="qf-ed-section qf-ed-features"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="qf-ed-section-heading">
          <span className="qf-ed-kicker"><RedStar /> A STUDY SYSTEM THAT MOVES WITH YOU</span>
          <h2>Make every session<br /><span>count.</span></h2>
        </div>
        <div className="qf-ed-feature-list">
          {features.map(({ number, icon: Icon, title, description }, index) => (
            <motion.article
              className="qf-ed-feature"
              key={number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.1, ease: 'easeOut' }}
            >
              <span className="qf-ed-feature-number">{number}</span>
              <div className="qf-ed-feature-title">
                <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                <h3>{title}</h3>
              </div>
              <p>{description}</p>
              <ArrowUpRight className="qf-ed-feature-arrow" size={23} strokeWidth={1.6} aria-hidden="true" />
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="qf-ed-section qf-ed-how"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="qf-ed-how-heading">
          <span className="qf-ed-kicker">NO FUSS. JUST PROGRESS.</span>
          <h2>How it works<span className="qf-ed-period">.</span></h2>
          <RedStar />
        </div>
        <div className="qf-ed-steps">
          {steps.map(({ number, title, description }, index) => (
            <motion.article
              className="qf-ed-step"
              key={number}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.09, ease: 'easeOut' }}
            >
              <span className="qf-ed-step-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="qf-ed-cta"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <span className="qf-ed-kicker">READY WHEN YOU ARE <RedStar /></span>
        <h2>Make your next<br />study session <span>count.</span></h2>
        <Link to="/create" className="qf-ed-round-link qf-ed-cta-link">
          <span>Create a Quiz</span>
          <ArrowUpRight size={22} strokeWidth={1.8} />
        </Link>
        <span className="qf-ed-cta-stamp" aria-hidden="true">START<br />HERE</span>
      </motion.section>
    </main>
  );
}
