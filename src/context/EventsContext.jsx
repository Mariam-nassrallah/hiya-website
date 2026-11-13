import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { fetchEvents } from '../data/api';
import { useJsonData } from '../data/useJsonData';
import { readStore, writeStore } from '../utils/format';
import { getNextEvent } from '../utils/events';
import RegisterModal from '../components/RegisterModal';
import '../styles/events.css';

const EventsContext = createContext(null);
const REG_KEY = 'hiyaRegs';
const REFRESH_MS = 60000; // re-check which event is next once a minute

function loadRegs() {
  const saved = readStore(REG_KEY, {});
  return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
}

/**
 * Loads events.json, works out the next upcoming event, keeps the
 * registrations and renders the single shared RegisterModal.
 */
export function EventsProvider({ children }) {
  const { data: events, error, loading } = useJsonData(fetchEvents);
  // Saved as { [eventId]: { name, phone, email, guests, notes, code, eventDate } }
  const [savedRegs, setRegs] = useState(loadRegs);
  const [now, setNow] = useState(() => new Date());
  const [modal, setModal] = useState({ open: false, eventId: null });
  const trigger = useRef(null); // element that opened the modal, to return focus

  useEffect(() => writeStore(REG_KEY, savedRegs), [savedRegs]);

  // A registration only counts for the event it was made for: same id AND same
  // date. Ids can be reused when events.json is replaced.
  const regs = useMemo(() => {
    const valid = {};
    for (const ev of events ?? []) {
      const rec = savedRegs[ev.id];
      if (rec && rec.eventDate === ev.date) valid[ev.id] = rec;
    }
    return valid;
  }, [events, savedRegs]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  const nextEvent = useMemo(() => getNextEvent(events, now), [events, now]);

  const takenOf = useCallback((ev) => ev.taken + (regs[ev.id]?.guests ?? 0), [regs]);

  const openRegistration = useCallback((ev, opener) => {
    trigger.current = opener ?? null;
    setModal({ open: true, eventId: ev.id });
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, open: false }));
    const el = trigger.current;
    if (el) requestAnimationFrame(() => el.focus());
  }, []);

  const register = useCallback(
    (eventId, record) => {
      const ev = events?.find((e) => e.id === eventId);
      setRegs((r) => ({ ...r, [eventId]: { ...record, eventDate: ev?.date } }));
    },
    [events],
  );

  const current = events?.find((e) => e.id === modal.eventId) ?? null;

  const value = useMemo(
    () => ({ events, loading, error, nextEvent, regs, takenOf, openRegistration }),
    [events, loading, error, nextEvent, regs, takenOf, openRegistration],
  );

  return (
    <EventsContext.Provider value={value}>
      {children}
      <RegisterModal
        open={modal.open}
        event={current}
        registration={current ? regs[current.id] : undefined}
        seatsLeft={current ? Math.max(0, current.seats - takenOf(current)) : 0}
        onClose={closeModal}
        onRegister={register}
      />
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used inside <EventsProvider>');
  return ctx;
}
