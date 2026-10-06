import React, { useState, useRef, useEffect } from 'react';
import { useTheme, type Theme } from '../../../hooks/useTheme';
import { useLocale } from '../../../hooks/useLocale';
import type { Locale } from '../../../i18n';
import './DeveloperConsole.css';

export type CommandName =
  | 'help'
  | 'about'
  | 'work'
  | '3d'
  | 'intro'
  | 'contact'
  | 'github'
  | 'hire'
  | 'theme'
  | 'lang'
  | 'clear';

export interface DeveloperConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVideo?: () => void;
}

interface OutputEntry {
  id: string;
  type: 'banner' | 'input' | 'output' | 'error' | 'success';
  content: React.ReactNode;
}

const INITIAL_BANNER: OutputEntry = {
  id: 'banner',
  type: 'banner',
  content: (
    <div className="cli-banner-text">
      <div className="cli-banner-accent">AP // PORTFOLIO TERMINAL</div>
      <div className="cli-banner-sub">crafted with &lt;3 by parikesitad-pm</div>
      <br />
      <div>Hello, curious human.</div>
      <br />
      <div>portfolio.owner = &quot;Afrizal Pramudyan&quot;;</div>
      <div>portfolio.focus = &quot;3D / CGI&quot;;</div>
      <div>portfolio.status = &quot;creating&quot;;</div>
      <br />
      <div>crafted.by = &quot;parikesitad-pm&quot;;</div>
      <div>github = &quot;github.com/parikesitad-pm&quot;;</div>
      <br />
      <div className="cli-banner-prompt-hint">type &quot;help&quot; to explore.</div>
    </div>
  ),
};

export const DeveloperConsole: React.FC<DeveloperConsoleProps> = ({
  isOpen,
  onClose,
  onOpenVideo,
}) => {
  const { setTheme } = useTheme();
  const { setLocale, t } = useLocale();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<OutputEntry[]>([INITIAL_BANNER]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const skipRestoreFocusRef = useRef<boolean>(false);

  // Focus trap, focus restoration & Escape handling
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    skipRestoreFocusRef.current = false;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusables = dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (!focusables.length) {
          e.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !dialog.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !dialog.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      if (!skipRestoreFocusRef.current && previouslyFocusedRef.current) {
        const elToFocus = previouslyFocusedRef.current;
        requestAnimationFrame(() => {
          elToFocus.focus();
        });
      }
    };
  }, [isOpen, onClose]);

  // Auto-scroll to bottom of terminal output
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  if (!isOpen) return null;

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      skipRestoreFocusRef.current = true;
      onClose();
      window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleCommand = (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // Add to input history
    setCommandHistory((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase();

    const entryId = `${Date.now()}-${Math.random()}`;
    const userPromptEntry: OutputEntry = {
      id: `${entryId}-cmd`,
      type: 'input',
      content: `> ${trimmed}`,
    };

    let responseEntry: OutputEntry | null = null;

    switch (cmd) {
      case 'help':
        responseEntry = {
          id: entryId,
          type: 'output',
          content: (
            <div className="cli-help-table">
              <div><span className="cli-cmd-name">help</span> — list available commands</div>
              <div><span className="cli-cmd-name">about</span> — creator perspective &amp; background</div>
              <div><span className="cli-cmd-name">work</span> — scroll to selected works gallery (#work)</div>
              <div><span className="cli-cmd-name">3d</span> — navigate to 3D ModelStage (#3d)</div>
              <div><span className="cli-cmd-name">intro</span> — launch self-introduction video modal</div>
              <div><span className="cli-cmd-name">contact</span> — scroll to contact &amp; commissioning (#contact)</div>
              <div><span className="cli-cmd-name">github</span> — open parikesitad-pm GitHub profile</div>
              <div><span className="cli-cmd-name">hire</span> — web development &amp; branding service inquiry</div>
              <div><span className="cli-cmd-name">theme [light|dark]</span> — switch visual theme</div>
              <div><span className="cli-cmd-name">lang [en|zh-CN|ja|ko]</span> — switch interface locale</div>
              <div><span className="cli-cmd-name">clear</span> — clear terminal screen</div>
            </div>
          ),
        };
        break;

      case 'about':
        responseEntry = {
          id: entryId,
          type: 'output',
          content: (
            <div>
              <div className="cli-accent">Afrizal Pramudyan — Multidisciplinary Visual Designer</div>
              <p className="cli-muted-text">
                Indonesian visual designer working across 3D modeling, CGI, graphic design, animation,
                photography, and videography. Visual Communication Design (DKV) at Universitas Negeri Semarang.
              </p>
            </div>
          ),
        };
        break;

      case 'work':
        responseEntry = {
          id: entryId,
          type: 'success',
          content: 'Navigating to Selected Works (#work)...',
        };
        scrollToSection('work');
        break;

      case '3d':
        responseEntry = {
          id: entryId,
          type: 'success',
          content: 'Navigating to 3D ModelStage (#3d)...',
        };
        scrollToSection('3d');
        break;

      case 'intro':
        responseEntry = {
          id: entryId,
          type: 'success',
          content: 'Opening self-introduction video modal...',
        };
        skipRestoreFocusRef.current = true;
        onClose();
        if (onOpenVideo) {
          window.setTimeout(() => {
            onOpenVideo();
          }, 150);
        }
        break;

      case 'contact':
        responseEntry = {
          id: entryId,
          type: 'success',
          content: 'Navigating to Contact (#contact)...',
        };
        scrollToSection('contact');
        break;

      case 'github':
        responseEntry = {
          id: entryId,
          type: 'success',
          content: 'Opening github.com/parikesitad-pm in new tab...',
        };
        window.open('https://github.com/parikesitad-pm', '_blank', 'noopener,noreferrer');
        break;

      case 'hire':
        responseEntry = {
          id: entryId,
          type: 'output',
          content: (
            <div className="cli-hire-box">
              <div className="cli-accent">Need your own profile page?</div>
              <div className="cli-hire-list">
                <div>· Personal Portfolio</div>
                <div>· Online Business Card</div>
                <div>· Personal Branding</div>
                <div>· Creative Landing Page</div>
              </div>
              <br />
              <div className="cli-sub">crafted with &lt;3 by parikesitad-pm</div>
              <div>WhatsApp: 0822 9850 3412</div>
              <br />
              <a
                href="https://wa.me/6282298503412"
                target="_blank"
                rel="noopener noreferrer"
                className="cli-wa-link"
              >
                Open WhatsApp Chat (wa.me/6282298503412) ↗
              </a>
            </div>
          ),
        };
        break;

      case 'theme':
        if (arg === 'light' || arg === 'dark') {
          setTheme(arg as Theme);
          responseEntry = {
            id: entryId,
            type: 'success',
            content: `Theme set to: ${arg}`,
          };
        } else {
          responseEntry = {
            id: entryId,
            type: 'error',
            content: 'Usage: theme light | theme dark',
          };
        }
        break;

      case 'lang':
        if (arg === 'en' || arg === 'zh-cn' || arg === 'ja' || arg === 'ko') {
          const mappedLocale = (arg === 'zh-cn' ? 'zh-CN' : arg) as Locale;
          setLocale(mappedLocale);
          responseEntry = {
            id: entryId,
            type: 'success',
            content: `Language switched to: ${mappedLocale}`,
          };
        } else {
          responseEntry = {
            id: entryId,
            type: 'error',
            content: 'Usage: lang en | lang zh-CN | lang ja | lang ko',
          };
        }
        break;

      case 'clear':
        setHistory([INITIAL_BANNER]);
        setInputVal('');
        return;

      default:
        responseEntry = {
          id: entryId,
          type: 'error',
          content: `Command not recognized: "${trimmed}". Type "help" to list available commands.`,
        };
    }

    setHistory((prev) => [...prev, userPromptEntry, responseEntry]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!commandHistory.length) return;
      const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div
      className="cli-dialog-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cli-dialog-title"
        className="cli-terminal-window"
      >
        {/* Terminal Header */}
        <div className="cli-window-header">
          <div className="cli-header-left">
            <span className="cli-window-dot dot--red" />
            <span className="cli-window-dot dot--yellow" />
            <span className="cli-window-dot dot--green" />
            <span id="cli-dialog-title" className="cli-window-title">
              {t.cli.title}
            </span>
          </div>
          <button
            type="button"
            className="cli-close-btn"
            onClick={onClose}
            aria-label={t.cli.closeButton}
          >
            ✕
          </button>
        </div>

        {/* Terminal Screen & Logs */}
        <div className="cli-terminal-screen" onClick={() => inputRef.current?.focus()}>
          {history.map((entry) => (
            <div key={entry.id} className={`cli-log-line cli-log--${entry.type}`}>
              {entry.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="cli-input-bar">
          <span className="cli-input-prompt">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className="cli-terminal-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.cli.inputPlaceholder}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

