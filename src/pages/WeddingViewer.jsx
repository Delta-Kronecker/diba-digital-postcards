import React, { useState } from 'react';
import { INVITATIONS_DATA } from '../data/invitations';
import ThreeDEnvelope from '../components/3DEnvelope';
import AudioPlayer from '../components/AudioPlayer';
import RSVPModal from '../components/RSVPModal';
import PhotoLightbox from '../components/PhotoLightbox';
import ViewerShell from '../components/ViewerShell';
import InvitationCard from '../components/InvitationCard';

export default function WeddingViewer({ onNavigate = () => {} }) {
  const data = INVITATIONS_DATA['wedding-amir-sara'];
  const [isOpen, setIsOpen] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightboxAt = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    /* item 90 — the bar, the toast and the copy state live in `ViewerShell`. */
    <ViewerShell onNavigate={onNavigate} copyLabel="لینک دعوت در حافظه کپی شد">
      {({ copied, onCopy }) => (
        <>
          <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-14">
            {/* The stage is the whole page and its only title is `sr-only`, so a
                visitor landed on a bare envelope with nothing naming it. The kicker
                is a paragraph, never a heading: there is still exactly one `h1` —
                this sr-only one while the stage is closed, handed to the card's own
                `h1` once the envelope opens. */}
            <div className="mb-6 text-center">
              {!isOpen && (
                <h1 className="sr-only">دعوتنامهٔ عروسی امیرحسین و سارا</h1>
              )}
              <p className="flex items-center justify-center gap-3 text-xs text-ink-subtle">
                <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
                <span>{data.categoryTitle}</span>
                <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
              </p>
            </div>

            <ThreeDEnvelope
              isOpen={isOpen}
              onOpen={() => setIsOpen(true)}
              openLabel="گشودن پاکت دعوت"
              sealText={data.theme.sealText}
              accent={data.theme.accentColor}
              metal={data.theme.hasGold}
            >
              <InvitationCard
                data={data}
                variant="wedding"
                audio={<AudioPlayer trackType={data.audioTrack.type} trackTitle={data.audioTrack.title} />}
                onRsvp={() => setIsRsvpOpen(true)}
                onLightbox={openLightboxAt}
                onCopy={onCopy}
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
        </>
      )}
    </ViewerShell>
  );
}
