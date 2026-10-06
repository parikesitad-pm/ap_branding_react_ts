import React, { useState } from 'react';
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
import './Home.css';

export const Home: React.FC = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const videoId = import.meta.env.VITE_INTRO_VIDEO_ID || 'yR3IpNwjKfY';

  return (
    <>
      <Preloader onComplete={() => setPreloaderDone(true)} />

      <PageLayout headerVariant="hero">
        <div className="home-page-flow">
          {/* F2: Hero Section */}
          <Hero isReady={preloaderDone} />

          {/* F2: Intro Statement */}
          <Intro />

          {/* F3: Selected Works / Horizontal Reel */}
          <Reel />

          {/* F4: 3D ModelStage Centerpiece */}
          <ModelStage />

          {/* F5: What I Make (Disciplines) */}
          <Disciplines />

          {/* F5: About & Verified Timeline */}
          <About />

          {/* F5: Meet Afrizal — Self Introduction Video Facade */}
          <WatchIntroSection onOpenVideo={() => setIsVideoModalOpen(true)} />

          {/* F5: Contact, Canonical Attribution, Developer CTA & CLI trigger */}
          <ContactFooter onOpenConsole={() => setIsConsoleOpen(true)} />
        </div>
      </PageLayout>

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
