import { useEffect, useMemo, useState } from "react";
import { ProjectData, OwnershipEntry } from "../types";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "../../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Separator } from "../../ui/separator";
import { clients } from "@/lib/data/clients";
import { getAvatarUrl } from "@/lib/assets/avatars";

interface StepOwnershipProps {
  data: ProjectData;
  updateData: (updates: Partial<ProjectData>) => void;
}

interface Account {
  id: string;
  name: string;
  email: string;
  team?: string;
  initials: string;
}

const DEFAULT_OWNER_ID = "anupam";

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: "anupam",
    name: "Anupam",
    email: "anupamsaha.work@gmail.com",
    team: "Product",
    initials: "AS",
  },
  {
    id: "alex-morgan",
    name: "Alex Morgan",
    email: "alex.morgan@workspace.com",
    team: "Product",
    initials: "AM",
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    email: "sarah.chen@workspace.com",
    team: "Engineering",
    initials: "SC",
  },
  {
    id: "mike-ross",
    name: "Mike Ross",
    email: "mike.ross@workspace.com",
    team: "Design",
    initials: "MR",
  },
  {
    id: "harrold",
    name: "Harrold",
    email: "harrold@workspace.com",
    team: "Engineering",
    initials: "H",
  },
  {
    id: "james",
    name: "James",
    email: "james.boarnd@workspace.com",
    team: "Product",
    initials: "JB",
  },
  {
    id: "mitch",
    name: "Mitch",
    email: "mitch.sato@workspace.com",
    team: "Design",
    initials: "MS",
  },
];
function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0]?.[0]?.toUpperCase() ?? "";
  const first = parts[0]?.[0];
  const last = parts[parts.length - 1]?.[0];
  return `${first ?? ""}${last ?? ""}`.toUpperCase();
}

export function StepOwnership({ data, updateData }: StepOwnershipProps) {
  const [accounts, setAccounts] = useState<Account[]>(DEFAULT_ACCOUNTS);
  const [query, setQuery] = useState("");
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const ownerId = data.ownerId ?? DEFAULT_OWNER_ID;

  useEffect(() => {
    if (!data.ownerId) {
      updateData({ ownerId: DEFAULT_OWNER_ID });
    }
  }, [data.ownerId, updateData]);

  useEffect(() => {
    if (!data.contributorOwnerships || data.contributorOwnerships.length === 0) {
      updateData({
        contributorOwnerships: [{ accountId: "harrold", access: "can_edit" }],
        contributorIds: ["harrold"],
      });
    }
  }, [data.contributorOwnerships, updateData]);

  useEffect(() => {
    if (!data.stakeholderOwnerships || data.stakeholderOwnerships.length === 0) {
      updateData({
        stakeholderOwnerships: [
          { accountId: "james", access: "can_view" },
          { accountId: "mitch", access: "can_view" },
        ],
        stakeholderIds: ["james", "mitch"],
      });
    }
  }, [data.stakeholderOwnerships, updateData]);

  const contributorOwnerships: OwnershipEntry[] =
    data.contributorOwnerships ?? data.contributorIds.map<OwnershipEntry>((id) => ({
      accountId: id,
      access: "can_edit",
    }));

  const stakeholderOwnerships: OwnershipEntry[] =
    data.stakeholderOwnerships ?? data.stakeholderIds.map<OwnershipEntry>((id) => ({
      accountId: id,
      access: "can_view",
    }));

  const ownerAccount = useMemo(
    () => accounts.find((a) => a.id === ownerId) ?? accounts[0],
    [accounts, ownerId]
  );

  const getAccountById = (accountId: string): Account | undefined =>
    accounts.find((a) => a.id === accountId);

  const syncOwnerships = (
    target: "contributors" | "stakeholders",
    list: OwnershipEntry[]
  ) => {
    if (target === "contributors") {
      updateData({
        contributorOwnerships: list,
        contributorIds: list.map((entry) => entry.accountId),
      });
    } else {
      updateData({
        stakeholderOwnerships: list,
        stakeholderIds: list.map((entry) => entry.accountId),
      });
    }
  };

  const handleAdd = (target: "contributors" | "stakeholders") => {
    const value = query.trim();
    if (!value) return;

    setIsAddMenuOpen(false);

    const currentList =
      target === "contributors" ? contributorOwnerships : stakeholderOwnerships;

    let account = accounts.find(
      (a) =>
        a.email.toLowerCase() === value.toLowerCase() ||
        a.name.toLowerCase() === value.toLowerCase()
    );

    if (!account) {
      const isEmail = value.includes("@");
      const name = isEmail ? value.split("@")[0].replace(/[._]/g, " ") : value;
      account = {
        id: `temp-${Date.now()}`,
        name,
        email: isEmail ? value : "",
        initials: getInitials(name),
      };
      setAccounts((prev) => [...prev, account!]);
    }

    if (!account || currentList.some((entry) => entry.accountId === account!.id)) {
      setQuery("");
      return;
    }

    const access: OwnershipEntry["access"] =
      target === "contributors" ? "can_edit" : "can_view";

    const nextList: OwnershipEntry[] = [
      ...currentList,
      { accountId: account.id, access },
    ];

    syncOwnerships(target, nextList);
    setQuery("");
  };

  const handlePermissionChange = (
    target: "contributors" | "stakeholders",
    accountId: string,
    access: OwnershipEntry["access"]
  ) => {
    const currentList =
      target === "contributors" ? contributorOwnerships : stakeholderOwnerships;

    const nextList = currentList.map((entry) =>
      entry.accountId === accountId ? { ...entry, access } : entry
    );

    syncOwnerships(target, nextList);
  };

  const handleRemove = (target: "contributors" | "stakeholders", accountId: string) => {
    const currentList =
      target === "contributors" ? contributorOwnerships : stakeholderOwnerships;

    const nextList = currentList.filter((entry) => entry.accountId !== accountId);
    syncOwnerships(target, nextList);
  };

  return (
    <div className="flex flex-col space-y-1.5 bg-muted p-2 rounded-lg">
      <p className="text-sm px-3 py-2 text-muted-foreground">
        Define who owns, contributes to, and follows this project.
      </p>

      <div className="space-y-2">
        {/* Client selection */}
        <div className="px-3 flex flex-col space-y-2">
          <Label className="text-sm text-muted-foreground">Client</Label>
          <Select
            value={data.clientId ?? "__none"}
            onValueChange={(val) => {
              if (val === "__none") {
                updateData({ clientId: undefined });
              } else {
                updateData({ clientId: val });
              }
            }}
          >
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">
                <span className="text-xs text-muted-foreground">No client</span>
              </SelectItem>
              <SelectSeparator />
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="text-xs font-medium">{c.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Separator />

        {/* Add people input + Add button */}
        <div className="space-y-3 bg-background rounded-lg border border-border mx-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Enter teams, name or email address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 border-none focus-visible:border-none focus-visible:ring-0"
            />
            <Popover open={isAddMenuOpen} onOpenChange={setIsAddMenuOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="flex gap-1 text-sm font-medium"
                  disabled={!query.trim()}
                >
                  Add
                  <Plus className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-44 p-1">
                <div className="flex flex-col">
                  <button
                    type="button"
                    className="flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => handleAdd("contributors")}
                  >
                    <span className="flex-1 text-left">Contributors</span>
                  </button>
                  <button
                    type="button"
                    className="mt-1 flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => handleAdd("stakeholders")}
                  >
                    <span className="flex-1 text-left">Stakeholders</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Owner - Required */}
        <div className="px-3 flex flex-col space-y-3">
          <Label className="text-sm text-muted-foreground">
            Project Owner
          </Label>
          <div className="flex items-center justify-between rounded-lg border-border bg-muted/40">
            <div className="flex items-center gap-3">
              <Avatar className="h-5 w-5">
                {ownerAccount && (
                  <AvatarImage src={getAvatarUrl(ownerAccount.name)} />
                )}
                <AvatarFallback>
                  {ownerAccount ? ownerAccount.initials : "PO"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">
                  {ownerAccount?.name ?? "Project owner"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value="full_access" disabled>
                <SelectTrigger className="h-8 flex gap-2 rounded-md border-none bg-transparent p-2 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_access">Full access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
<Separator />

        
        {/* Contributors - Multi-select mockup */}
        <div className="space-y-3 px-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-regular text-muted-foreground">Contributors</Label>
          </div>

          <div className="space-y-2">
            {contributorOwnerships.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add people who will help execute this project.
              </p>
            ) : (
              contributorOwnerships.map((entry) => {
                const account = getAccountById(entry.accountId);
                if (!account || account.id === ownerId) return null;
                const avatarUrl = getAvatarUrl(account.name);

                return (
                  <div
                    key={entry.accountId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-5 w-5 text-xs bg-background border border-border">
                        {avatarUrl && <AvatarImage src={avatarUrl} />}
                        <AvatarFallback>{account.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {account.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={entry.access}
                        onValueChange={(val) => {
                          if (val === "__remove") {
                            handleRemove("contributors", entry.accountId);
                            return;
                          }

                          handlePermissionChange(
                            "contributors",
                            entry.accountId,
                            val as OwnershipEntry["access"]
                          );
                        }}
                      >
                        <SelectTrigger className="h-8 inline-flex items-center gap-1.5 rounded-md border-none bg-accent/70 px-3 py-1 text-xs font-medium shadow-none">
                          <span className="text-xs font-medium">
                            {entry.access === "can_edit" ? "Can edit" : "Can view"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="can_edit">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">Can edit</span>
                              <span className="text-[11px] text-muted-foreground">
                                Can edit but not share
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="can_view">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">Can view</span>
                              <span className="text-[11px] text-muted-foreground">
                                Cannot edit or share
                              </span>
                            </div>
                          </SelectItem>
                          <SelectSeparator />
                          <SelectItem value="__remove">
                            <span className="text-xs text-destructive">Remove</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
<Separator />
        {/* Stakeholders list */}
        <div className="space-y-3 px-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-regular text-muted-foreground">Stakeholders</Label>
          </div>

          <div className="space-y-2">
            {stakeholderOwnerships.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add people who should stay informed about this project.
              </p>
            ) : (
              stakeholderOwnerships.map((entry) => {
                const account = getAccountById(entry.accountId);
                if (!account || account.id === ownerId) return null;
                const avatarUrl = getAvatarUrl(account.name);

                return (
                  <div
                    key={entry.accountId}
                    className="flex items-center justify-between rounded-md hover:bg-accent/40"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-5 w-5 text-xs bg-background border border-border">
                        {avatarUrl && <AvatarImage src={avatarUrl} />}
                        <AvatarFallback>{account.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {account.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={entry.access}
                        onValueChange={(val) => {
                          if (val === "__remove") {
                            handleRemove("stakeholders", entry.accountId);
                            return;
                          }

                          handlePermissionChange(
                            "stakeholders",
                            entry.accountId,
                            val as OwnershipEntry["access"]
                          );
                        }}
                      >
                        <SelectTrigger className="h-8 inline-flex items-center gap-1.5 rounded-md border-none bg-accent/70 px-3 py-1 text-xs font-medium shadow-none">
                          <span className="text-xs font-medium">
                            {entry.access === "can_edit" ? "Can edit" : "Can view"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="can_edit">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">Can edit</span>
                              <span className="text-[11px] text-muted-foreground">
                                Can edit but not share
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="can_view">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">Can view</span>
                              <span className="text-[11px] text-muted-foreground">
                                Cannot edit or share
                              </span>
                            </div>
                          </SelectItem>
                          <SelectSeparator />
                          <SelectItem value="__remove">
                            <span className="text-xs text-destructive">Remove</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
