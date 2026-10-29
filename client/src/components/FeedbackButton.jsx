import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { getDeviceId } from '../utils/deviceId.js';

const TYPES = ['Bug', 'Idea', 'Other'];

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('Bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const closeTimer = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.2 };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const close = () => {
    clearTimeout(closeTimer.current);
    setIsOpen(false);
    setSuccess(false);
    setError('');
  };

  const sendFeedback = async (event) => {
    event.preventDefault();
    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message: message.trim(),
          email: email.trim(),
          deviceId: getDeviceId(),
          page: window.location.pathname,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        // Use the generic message when the server does not return JSON.
      }

      if (!response.ok) {
        setError(data.error || 'Could not send your feedback. Please try again.');
        return;
      }

      setSuccess(true);
      closeTimer.current = setTimeout(close, 2000);
    } catch {
      setError('Could not connect to the server. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        className="feedback-trigger"
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <MessageSquare size={18} aria-hidden="true" />
        <span>Feedback</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="feedback-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition }}
            exit={{ opacity: 0, transition }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !sending) close();
            }}
          >
            <motion.section
              className="feedback-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="feedback-title"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition }}
              exit={{ opacity: 0, y: 10, scale: 0.98, transition }}
            >
              <div className="feedback-modal-header">
                <h2 id="feedback-title">Send feedback</h2>
                <button
                  className="feedback-close"
                  type="button"
                  onClick={close}
                  disabled={sending}
                  aria-label="Close feedback"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {success ? (
                <p className="feedback-success" role="status">
                  Thank you! Your feedback was sent.
                </p>
              ) : (
                <form className="feedback-form" onSubmit={sendFeedback}>
                  <div className="feedback-types" aria-label="Feedback type">
                    {TYPES.map((item) => (
                      <button
                        key={item}
                        className={`feedback-type ${type === item ? 'selected' : ''}`}
                        type="button"
                        onClick={() => setType(item)}
                        aria-pressed={type === item}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <label className="feedback-field">
                    <span>Your feedback</span>
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      maxLength={1000}
                      required
                      rows={5}
                    />
                    <span className="feedback-character-count">{message.length} / 1000</span>
                  </label>

                  <label className="feedback-field">
                    <span>Email (optional)</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                    />
                  </label>

                  <p className="feedback-note">Please don't include private information.</p>
                  {error && <p className="feedback-error" role="alert">{error}</p>}

                  <button className="feedback-send" type="submit" disabled={sending || !message.trim()}>
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </form>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
