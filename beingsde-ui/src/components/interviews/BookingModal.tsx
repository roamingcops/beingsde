import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { Profile } from "./types";

interface BookingModalProps {
  profile: Profile;
  onClose: () => void;
  onBook: (topic: string, scheduledAt: string, meetingLink: string) => Promise<void>;
}

export function BookingModal({ profile, onClose, onBook }: BookingModalProps) {
  const [bookingTopic, setBookingTopic] = useState(profile.topics[0] || "System Design");
  const [bookingDateTime, setBookingDateTime] = useState("");
  const [bookingMeetingLink, setBookingMeetingLink] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const handleBook = async () => {
    if (!bookingTopic || !bookingDateTime) return;
    setIsBooking(true);
    try {
      const isoDateTime = new Date(bookingDateTime).toISOString();
      await onBook(bookingTopic, isoDateTime, bookingMeetingLink);
      onClose();
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-2xl flex flex-col gap-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-1">
          <h2 className="text-md font-bold text-zinc-800 dark:text-zinc-100">
            Schedule Practice Session
          </h2>
          <span className="text-2xs text-zinc-500 font-medium">
            Simulate a live design interview with <strong className="text-zinc-700 dark:text-zinc-300">{profile.name}</strong>
          </span>
        </div>

        {((profile.availabilitySlots && profile.availabilitySlots.length > 0) || profile.availabilityText) && (
          <div className="bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-800 p-3 rounded-md text-3xs text-zinc-500">
            <span className="font-bold text-zinc-400 block uppercase font-mono mb-1">Interviewer Availability</span>
            {profile.availabilitySlots && profile.availabilitySlots.length > 0 && (
              <div className="capitalize font-mono mb-0.5">
                Slots: {profile.availabilitySlots.map(s => s.toLowerCase().replace("_", " ")).join(", ")}
              </div>
            )}
            {profile.availabilityText && (
              <div className="italic text-zinc-400">
                Hours: {profile.availabilityText}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3.5 mt-2">
          <div className="flex flex-col gap-1">
            <label className="text-3xs font-mono font-bold uppercase text-zinc-400">Choose Topic</label>
            <select
              value={bookingTopic}
              onChange={(e) => setBookingTopic(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 rounded-md dark:bg-zinc-800"
            >
              {profile.topics.map((topic) => (
                <option key={topic} value={topic} className="dark:bg-zinc-800">
                  {topic}
                </option>
              ))}
              <option value="System Design Practice" className="dark:bg-zinc-800">Custom / General Design</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-3xs font-mono font-bold uppercase text-zinc-400">Simulated Meet Link (Optional)</label>
            <input
              type="url"
              value={bookingMeetingLink}
              onChange={(e) => setBookingMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/xyz-abc-qwe"
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 rounded-md dark:bg-zinc-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-3xs font-mono font-bold uppercase text-zinc-400">Scheduled Date & Time</label>
            <div className="flex items-center gap-2">
              <input
                type="datetime-local"
                value={bookingDateTime}
                onChange={(e) => setBookingDateTime(e.target.value)}
                required
                className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 rounded-md dark:bg-zinc-800"
              />
              <button
                onClick={handleBook}
                disabled={isBooking || !bookingDateTime || !bookingTopic}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 transition-all rounded-md shadow-sm disabled:opacity-50 h-[38px]"
              >
                {isBooking ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-start mt-2">
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-1.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
