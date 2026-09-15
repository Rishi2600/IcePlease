import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageHandledButton } from "@/components/admin/message-handled-button";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ handled: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  const unhandled = messages.filter((message) => !message.handled).length;

  return (
    <>
      <AdminPageHeader
        title="Messages"
        description={
          /* No email integration exists, so this is where contact-form
             messages actually live. */
          "Messages sent through the contact form. There is no email integration yet, so this inbox is the only place they arrive."
        }
      />

      {messages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Messages sent through the contact form will appear here."
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-muted">
            {unhandled} unread of {messages.length}
          </p>
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className={message.handled ? "opacity-70" : ""}>
                <CardHeader className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold">
                      {message.subject || "No subject"}
                    </h2>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      {message.name} ·{" "}
                      <a
                        href={`mailto:${message.email}`}
                        className="hover:text-ice-deep"
                      >
                        {message.email}
                      </a>
                      {message.phone ? ` · ${message.phone}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {message.handled ? (
                      <Badge tone="mint">Handled</Badge>
                    ) : (
                      <Badge tone="citrus">Unread</Badge>
                    )}
                    <span className="text-xs text-ink-muted">
                      {formatDateTime(message.createdAt)}
                    </span>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                    {message.message}
                  </p>
                  <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                    <MessageHandledButton
                      id={message.id}
                      handled={message.handled}
                      from={message.name}
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}
