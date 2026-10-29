"use client"

import { useState, type ChangeEvent } from "react"
import { motion } from "motion/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Client, ClientStatus, upsertClient } from "@/lib/data/clients"
import { X } from "@phosphor-icons/react/dist/ssr"

interface ClientWizardProps {
  mode: "create" | "edit"
  initialClient?: Client
  onClose: () => void
  onSubmit?: (client: Client) => void
}

export function ClientWizard({ mode, initialClient, onClose, onSubmit }: ClientWizardProps) {
  const [name, setName] = useState(initialClient?.name ?? "")
  const [status, setStatus] = useState<ClientStatus>(initialClient?.status ?? "active")
  const [primaryContactName, setPrimaryContactName] = useState(initialClient?.primaryContactName ?? "")
  const [primaryContactEmail, setPrimaryContactEmail] = useState(initialClient?.primaryContactEmail ?? "")
  const [industry, setIndustry] = useState(initialClient?.industry ?? "")
  const [website, setWebsite] = useState(initialClient?.website ?? "")
  const [location, setLocation] = useState(initialClient?.location ?? "")
  const [owner, setOwner] = useState(initialClient?.owner ?? "Anupam")
  const [notes, setNotes] = useState(initialClient?.notes ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEdit = mode === "edit"

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Client name is required")
      return
    }

    setIsSubmitting(true)
    try {
      const id = isEdit ? initialClient!.id : name.trim().toLowerCase().replace(/\s+/g, "-")
      const payload: Client = {
        id,
        name: name.trim(),
        status,
        primaryContactName: primaryContactName.trim() || undefined,
        primaryContactEmail: primaryContactEmail.trim() || undefined,
        industry: industry.trim() || undefined,
        website: website.trim() || undefined,
        location: location.trim() || undefined,
        owner: owner.trim() || undefined,
        notes: notes.trim() || undefined,
      }

      const saved = upsertClient(payload)
      toast.success(isEdit ? "Client updated" : "Client created")
      onSubmit?.(saved)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex w-full max-w-xl flex-col overflow-hidden rounded-[24px] bg-background shadow-2xl border border-border"
      >
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div>
            <p className="text-base font-semibold text-foreground">
              {isEdit ? "Edit client" : "New client"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Basic information about the client, primary contact and context.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-3 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Client name</Label>
              <Input
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ClientStatus)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_hold">On hold</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Primary contact name</Label>
              <Input
                value={primaryContactName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPrimaryContactName(e.target.value)}
                placeholder="e.g. Sarah Lee"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Primary contact email</Label>
              <Input
                type="email"
                value={primaryContactEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPrimaryContactEmail(e.target.value)}
                placeholder="name@company.com"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Industry</Label>
              <Input
                value={industry}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)}
                placeholder="Fintech, Healthcare..."
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Location</Label>
              <Input
                value={location}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Website</Label>
              <Input
                value={website}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)}
                placeholder="https://"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Owner (internal)</Label>
              <Select value={owner} onValueChange={setOwner}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Anupam">Anupam</SelectItem>
                  <SelectItem value="Alex Chen">Alex Chen</SelectItem>
                  <SelectItem value="Emma Wright">Emma Wright</SelectItem>
                  <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                  <SelectItem value="Alex Morgan">Alex Morgan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="Context about this client, expectations, or important details."
              className="min-h-24 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 bg-background px-6 py-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
            {isEdit ? "Save changes" : "Create client"}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
