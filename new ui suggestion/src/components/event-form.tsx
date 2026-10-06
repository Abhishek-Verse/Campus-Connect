"use client";

import { useActionState, useState } from "react";
import {
  AlertCircle,
  ImagePlus,
  Loader2,
  Rocket,
  Upload,
  X,
} from "lucide-react";
import { createEventAction } from "@/lib/actions/club";
import { CATEGORIES, INTERESTS, PRESET_POSTERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border-[1.5px] border-ink/20 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink/35 outline-none transition-all focus:border-ink focus:shadow-[3px_3px_0_rgba(24,22,17,0.85)]";

const labelCls = "mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-ink/50 uppercase";

async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxW = 900;
  const scale = Math.min(1, maxW / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function EventForm({ clubs }: { clubs: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(createEventAction, null);
  const [poster, setPoster] = useState<string>(PRESET_POSTERS[0].src);
  const [tags, setTags] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isCustom = poster.startsWith("data:");

  const toggleTag = (t: string) =>
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : prev.length >= 5 ? prev : [...prev, t],
    );

  const onUpload = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed.");
      return;
    }
    try {
      setUploadError(null);
      const url = await fileToDataUrl(file);
      if (url.length > 1_500_000) {
        setUploadError("Image is too large even after compression — try a smaller one.");
        return;
      }
      setPoster(url);
    } catch {
      setUploadError("Could not process that image.");
    }
  };

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="posterUrl" value={isCustom ? poster : poster.startsWith("/") ? poster : ""} />
      <input type="hidden" name="tags" value={tags.join(",")} />

      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-rose/60 bg-rose/10 px-4 py-3 text-[13px] text-rose">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {clubs.length > 0 && (
            <div>
              <label className={labelCls}>Organising club</label>
              <select name="clubId" className={inputCls} required defaultValue="">
                <option value="" disabled>
                  Select club…
                </option>
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className={labelCls}>Event title *</label>
            <input
              name="title"
              required
              maxLength={90}
              placeholder="e.g. NeuroHack '26 — 24h ML Hackathon"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Description *</label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="What will students do, learn or win? Who should attend? What should they bring?"
              className={inputCls}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Category *</label>
              <select name="category" required defaultValue="" className={inputCls}>
                <option value="" disabled>
                  Select…
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Venue *</label>
              <input name="venue" required placeholder="e.g. Innovation Lab, Block C" className={inputCls} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Date *</label>
              <input type="date" name="date" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Start time *</label>
              <input type="time" name="time" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Duration (hours)</label>
              <input type="number" name="duration" min={1} max={48} defaultValue={2} className={inputCls} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Participant limit *</label>
              <input
                type="number"
                name="capacity"
                required
                min={1}
                max={10000}
                placeholder="e.g. 50"
                className={inputCls}
              />
              <p className="mt-1.5 text-[11px] text-ink/40">
                Registration closes automatically when full.
              </p>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-[1.5px] border-ink/20 bg-cream px-4 py-3.5 transition-colors hover:border-ink/50">
                <input
                  type="checkbox"
                  name="requiresApproval"
                  className="h-4 w-4 shrink-0 accent-[#d63b22]"
                />
                <span className="text-[12.5px] leading-snug text-ink/65">
                  Require club approval for each registration
                </span>
              </label>
            </div>
          </div>
          <div>
            <label className={labelCls}>Interest tags (up to 5 — powers recommendations)</label>
            <div className="flex flex-wrap gap-1.5">
              {INTERESTS.map((t) => {
                const active = tags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={cn(
                      "rounded-full border-[1.5px] px-3 py-1.5 text-[12px] transition-all",
                      active
                        ? "border-ink bg-ink font-semibold text-cream shadow-[2px_2px_0_#d63b22]"
                        : "border-ink/25 bg-cream text-ink/55 hover:border-ink/60 hover:text-ink",
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* poster picker */}
        <div>
          <label className={labelCls}>Event poster</label>
          <div className="relative h-44 overflow-hidden rounded-xl border-[1.5px] border-ink/25">
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="Poster preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-ink/30">
                <ImagePlus className="h-6 w-6" />
              </div>
            )}
            {poster && !PRESET_POSTERS.some((p) => p.src === poster) && (
              <button
                type="button"
                onClick={() => setPoster(PRESET_POSTERS[0].src)}
                className="absolute top-2 right-2 rounded-full bg-ink/70 p-1.5 text-cream hover:bg-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {PRESET_POSTERS.map((p) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setPoster(p.src)}
                className={cn(
                  "relative aspect-[16/10] overflow-hidden rounded-lg border-[1.5px] transition-all",
                  poster === p.src
                    ? "border-ink shadow-[2px_2px_0_#d63b22]"
                    : "border-ink/20 opacity-60 hover:opacity-100",
                )}
                title={p.label}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.label} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-ink/30 bg-cream/50 py-3 text-[12.5px] text-ink/60 transition-colors hover:border-ink hover:text-ink">
            <Upload className="h-4 w-4" />
            Upload custom poster
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
            />
          </label>
          {uploadError && <p className="mt-2 text-[12px] text-rose">{uploadError}</p>}
          <p className="mt-2 text-[11px] leading-relaxed text-ink/40">
            Uploads are resized to web-friendly dimensions automatically. No poster?
            Leave a preset — or pick none and we render a branded gradient.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-ink bg-flame py-4 text-sm font-bold text-cream transition-all hover:shadow-[5px_5px_0_#181611] disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Rocket className="h-4 w-4" /> Publish event
          </>
        )}
      </button>
    </form>
  );
}
