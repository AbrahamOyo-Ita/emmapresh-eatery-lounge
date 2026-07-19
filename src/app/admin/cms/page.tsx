"use client";

import * as React from "react";
import { FileText, Image, Megaphone, Plus, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useCmsStore, type CmsContentType, type CmsStatus } from "@/stores/cms-store";
import { cn } from "@/lib/utils";

const contentTypes: CmsContentType[] = ["page", "hero", "announcement", "media"];
const statuses: CmsStatus[] = ["draft", "review", "published"];

const statusClassName: Record<CmsStatus, string> = {
  draft: "bg-cream-soft text-body",
  review: "bg-warning/10 text-warning",
  published: "bg-success/10 text-success",
};

export default function AdminCmsPage() {
  const { entries, addEntry, updateEntry } = useCmsStore();
  const [hydrated, setHydrated] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<CmsStatus | "all">("all");
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState<CmsContentType>("page");
  const [section, setSection] = React.useState("Marketing");
  const [summary, setSummary] = React.useState("");
  const [imagePath, setImagePath] = React.useState("");

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!hydrated) return null;

  const filtered = entries.filter((entry) => {
    const matchesStatus = status === "all" || entry.status === status;
    const haystack = `${entry.title} ${entry.slug} ${entry.section} ${entry.summary}`.toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  });
  const published = entries.filter((entry) => entry.status === "published").length;
  const needsReview = entries.filter((entry) => entry.status === "review").length;
  const media = entries.filter((entry) => entry.type === "media").length;

  function createEntry() {
    if (!title.trim()) return;
    addEntry({
      type,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      status: "draft",
      section,
      summary,
      imagePath: imagePath || undefined,
    });
    setTitle("");
    setSummary("");
    setImagePath("");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-charcoal">CMS</h1>
        <p className="mt-1 text-sm text-body">Content operations for pages, hero sections, announcements and media inventory.</p>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          { label: "Content Entries", value: entries.length, icon: FileText },
          { label: "Published", value: published, icon: Send },
          { label: "Needs Review", value: needsReview, icon: Megaphone },
          { label: "Media Records", value: media, icon: Image },
        ].map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border/60 bg-white p-5">
            <metric.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-2xl text-charcoal">{metric.value}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-body">{metric.label}</p>
          </div>
        ))}
      </section>

      <section className="mb-6 grid gap-5 lg:grid-cols-[380px_1fr]">
        <div className="rounded-2xl border border-border/60 bg-white p-5">
          <h2 className="font-display text-base text-charcoal">Create Content</h2>
          <div className="mt-4 space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Homepage lunch campaign" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Type</Label>
                <Select value={type} onChange={(event) => setType(event.target.value as CmsContentType)}>
                  {contentTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                </Select>
              </div>
              <div>
                <Label>Section</Label>
                <Input value={section} onChange={(event) => setSection(event.target.value)} />
              </div>
            </div>
            <div>
              <Label>Image Path</Label>
              <Input value={imagePath} onChange={(event) => setImagePath(event.target.value)} placeholder="/images/menu/..." />
            </div>
            <div>
              <Label>Summary</Label>
              <Textarea value={summary} onChange={(event) => setSummary(event.target.value)} />
            </div>
            <Button className="w-full" disabled={!title.trim()} onClick={createEntry}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Draft
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-white p-5">
          <h2 className="font-display text-base text-charcoal">Publishing Workflow</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {statuses.map((item) => (
              <div key={item} className="rounded-xl bg-cream-soft/60 p-4">
                <p className="text-sm font-semibold capitalize text-charcoal">{item}</p>
                <p className="mt-1 font-display text-2xl text-primary">{entries.filter((entry) => entry.status === item).length}</p>
                <p className="mt-1 text-xs text-body">Entries in {item.replace(/-/g, " ")}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-border/60 p-4">
            <p className="text-sm font-semibold text-charcoal">Image Readiness</p>
            <p className="mt-1 text-xs text-body">Keep final product/branch media paths here so replacing placeholders later is a controlled CMS task.</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream-soft">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.round((media / Math.max(entries.length, 1)) * 100))}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
          <div className="relative min-w-64 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body" aria-hidden="true" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search content" className="pl-10" />
          </div>
          <Select value={status} onChange={(event) => setStatus(event.target.value as CmsStatus | "all")} className="w-auto min-w-40">
            <option value="all">All status</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((entry) => (
            <div key={entry.id} className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_180px_180px]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-charcoal">{entry.title}</p>
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold capitalize", statusClassName[entry.status])}>{entry.status}</span>
                </div>
                <p className="mt-1 text-xs text-body">/{entry.slug} · {entry.section} · {entry.type}</p>
                <p className="mt-2 text-sm text-body">{entry.summary}</p>
                {entry.imagePath && <p className="mt-2 font-mono text-xs text-primary">{entry.imagePath}</p>}
              </div>
              <div>
                <Label>Status</Label>
                <Select value={entry.status} onChange={(event) => updateEntry(entry.id, { status: event.target.value as CmsStatus })}>
                  {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                </Select>
              </div>
              <div>
                <Label>Section</Label>
                <Input value={entry.section} onChange={(event) => updateEntry(entry.id, { section: event.target.value })} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
