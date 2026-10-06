import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/templates/PageLayout/PageLayout';
import { Preloader } from '../components/organisms/Preloader/Preloader';
import { Hero } from '../components/organisms/Hero/Hero';
import { Intro } from '../components/organisms/Intro/Intro';
import { Reel } from '../components/organisms/Reel/Reel';
import { ModelStage } from '../components/organisms/ModelStage/ModelStage';
import { Disciplines } from '../components/organisms/Disciplines/Disciplines';
import { About } from '../components/organisms/About/About';
import { WatchIntroSection, VideoModal } from '../components/organisms/VideoModal';
import { ContactFooter } from '../components/organisms/ContactFooter/ContactFooter';
import { DeveloperConsole } from '../components/organisms/DeveloperConsole/DeveloperConsole';
import { ConsoleTrigger } from '../components/atoms/ConsoleTrigger/ConsoleTrigger';
import { KineticDisciplines } from '../components/organisms/KineticDisciplines/KineticDisciplines';
import './Home.css';

export const Home: React.FC = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  const videoId = import.meta.env.VITE_INTRO_VIDEO_ID || 'yR3IpNwjKfY';

  // Keyboard shortcut: Ctrl + ` or Cmd + ` toggles DeveloperConsole
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        const target = e.target as HTMLElement | null;
        const isInput =
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable);

        // If console is already open, pressing shortcut toggles it closed
        if (isConsoleOpen) {
          e.preventDefault();
          setIsConsoleOpen(false);
          return;
        }

        // If another modal has focus, ignore shortcut
        if (isVideoModalOpen || isModelModalOpen) {
          return;
        }

        // If user is typing in regular input/textarea outside console, ignore
        if (isInput) {
          return;
        }

        e.preventDefault();
        setIsConsoleOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isConsoleOpen, isVideoModalOpen, isModelModalOpen]);

  const isAnyModalOpen = isConsoleOpen || isVideoModalOpen || isModelModalOpen;

  return (
    <>
      <Preloader onComplete={() => setPreloaderDone(true)} />

      <PageLayout headerVariant="hero">
        <div className="home-page-flow">
          {/* F2: Hero Section */}
          <Hero isReady={preloaderDone} />

          {/* F2: Intro Statement (with Lando Norris scroll highlight text) */}
          <Intro />

          {/* Flying Kinetic Mediums Marquee (3D/CGI, Graphic, Motion, Photo, Film) */}
          <KineticDisciplines />

          {/* F3: Selected Works / Horizontal Reel */}
          <Reel />

          {/* F4: 3D ModelStage Centerpiece */}
          <ModelStage onModalStateChange={setIsModelModalOpen} />

          {/* F5: What I Make (Disciplines) */}
          <Disciplines />

          {/* F5: About & Verified Timeline */}
          <About />

          {/* F5: Meet Afrizal — Self Introduction Video Facade */}
          <WatchIntroSection onOpenVideo={() => setIsVideoModalOpen(true)} />

          {/* F5: Contact, Canonical Attribution, Developer CTA */}
          <ContactFooter />
        </div>
      </PageLayout>

      {/* Floating Developer CLI Trigger (>_) */}
      <ConsoleTrigger
        onClick={() => setIsConsoleOpen(true)}
        isVisible={preloaderDone && !isAnyModalOpen}
      />

      {/* Video Modal (youtube-nocookie facade mount) */}
      <VideoModal
        isOpen={isVideoModalOpen}
        videoId={videoId}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {/* Developer CLI Easter Egg Terminal */}
      <DeveloperConsole
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        onOpenVideo={() => setIsVideoModalOpen(true)}
      />
    </>
  );
};
