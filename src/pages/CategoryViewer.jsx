import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { INVITATIONS_DATA } from '../data/invitations';
import ThreeDEnvelope from '../components/3DEnvelope';
import AudioPlayer from '../components/AudioPlayer';
import RSVPModal from '../components/RSVPModal';
import PhotoLightbox from '../components/PhotoLightbox';
import ViewerBar from '../components/ViewerBar';
import InvitationCard from '../components/InvitationCard';

export default function CategoryViewer({ slug = 'general-gallery-opening', onNavigate = () => {} }) {
  const data = INVITATIONS_DATA[slug] || INVITATIONS_DATA['general-gallery-opening'];
  const [isOpen, setIsOpen] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      // Clipboard access can be denied; do not show a false success message.
    }
  };

  const openLightboxAt = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-dvh bg-canvas font-body text-ink">
      <ViewerBar onNavigate={onNavigate} onCopy={handleCopyLink} copied={copied} />

      {copied && (
        <div className="fixed left-1/2 top-20 z-toast flex -translate-x-1/2 items-center gap-2 border border-line bg-ink px-5 py-2.5 text-xs text-canvas shadow-lift">
          <CheckCircle2 className="size-3.5" aria-hidden="true" />
          لینک دعوت در حافظه کپی شد
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-14">
        {/* Same naming gap as the other two stages: a title only a screen reader
            could hear. The kicker names the collection on screen and stays a
            paragraph, so the `h1` count does not change. */}
        <div className="mb-6 text-center">
          {!isOpen && <h1 className="sr-only">{data.title}</h1>}
          <p className="flex items-center justify-center gap-3 text-xs text-ink-subtle">
            <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
            <span>{data.categoryTitle}</span>
            <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
          </p>
        </div>

        <ThreeDEnvelope
          isOpen={isOpen}
          onOpen={() => setIsOpen(true)}
          openLabel="گشودن پاکت"
          sealText={data.theme.sealText}
          accent={data.theme.accentColor}
          metal={data.theme.hasGold}
        >
          <InvitationCard
            data={data}
            variant="general"
            audio={<AudioPlayer trackType={data.audioTrack.type} trackTitle={data.audioTrack.title} accentColor={data.theme.accentColor} />}
            onRsvp={() => setIsRsvpOpen(true)}
            onLightbox={openLightboxAt}
            onCopy={handleCopyLink}
            copied={copied}
          />
        </ThreeDEnvelope>
      </div>

      <RSVPModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        eventSlug={data.slug}
        eventTitle={data.title}
        category={data.category}
        accentColor={data.theme.accentColor}
        hasGold={data.theme.hasGold}
      />

      <PhotoLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={data.images}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}
