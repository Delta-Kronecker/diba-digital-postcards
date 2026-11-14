import React, { useState } from 'react';
import { INVITATIONS_DATA } from '../data/invitations';
import ThreeDEnvelope from '../components/3DEnvelope';
import AudioPlayer from '../components/AudioPlayer';
import RSVPModal from '../components/RSVPModal';
import PhotoLightbox from '../components/PhotoLightbox';
import ViewerShell from '../components/ViewerShell';
import InvitationCard from '../components/InvitationCard';

export default function CategoryViewer({ slug = 'general-gallery-opening', onNavigate = () => {} }) {
  const data = INVITATIONS_DATA[slug] || INVITATIONS_DATA['general-gallery-opening'];
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
