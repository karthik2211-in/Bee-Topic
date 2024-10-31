"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  ShellIcon,
  SlashIcon,
} from "lucide-react";

import { cn } from "@bt/ui";
import { Button } from "@bt/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@bt/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@bt/ui/popover";

import { api } from "~/trpc/react";

export default function ChannelSwitcher() {
  const [open, setOpen] = React.useState(false);
  const params = useParams();
  const router = useRouter();
  const { data, isLoading } = api.channels.all.useQuery(undefined, {
    enabled: !!params.channel_id,
  });
  const channels =
    data?.map((channel) => ({
      value: channel.id,
      label: channel.title,
    })) ?? [];

  if (!params.channel_id) return null;

  return (
    <>
      <SlashIcon
        strokeWidth={0.3}
        size={24}
        className="text-muted-foreground"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            isLoading={isLoading}
            loadingText=""
            variant="ghost"
            role="combobox"
            size={"sm"}
            aria-expanded={open}
            className="w-fit justify-between"
          >
            {params.channel_id ? (
              <div className="flex items-center gap-3">
                <ShellIcon className="size-4" />
                {
                  channels.find(
                    (channel) => channel.value === params.channel_id,
                  )?.label
                }
              </div>
            ) : (
              "Select channel..."
            )}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search channel..." className="h-9" />
            <CommandList>
              <CommandEmpty>No channels found.</CommandEmpty>
              <CommandGroup>
                {channels.map((channel) => (
                  <CommandItem
                    key={channel.value}
                    value={channel.value}
                    onSelect={(currentValue) => {
                      router.push(`/${channel.value}`);
                      setOpen(false);
                    }}
                  >
                    <ShellIcon />
                    {channel.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        params.channel_id === channel.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
