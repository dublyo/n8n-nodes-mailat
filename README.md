# n8n-nodes-mailat

[![npm version](https://img.shields.io/npm/v/n8n-nodes-mailat.svg)](https://www.npmjs.com/package/n8n-nodes-mailat)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-mailat.svg)](https://www.npmjs.com/package/n8n-nodes-mailat)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Community n8n node for [Mailat](https://github.com/dublyo/mailat) — the open-source, self-hosted email platform. Send transactional emails, manage your inbox, and react to email events from n8n workflows.

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-mailat"><img src="https://img.shields.io/badge/npm-n8n--nodes--mailat-cb3837?style=for-the-badge&logo=npm" alt="npm" /></a>
  <a href="https://dublyo.com"><img src="https://img.shields.io/badge/Deploy%20Mailat-Dublyo%20PaaS-6366f1?style=for-the-badge" alt="Deploy on Dublyo" /></a>
  <a href="https://github.com/dublyo/mailat"><img src="https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub" /></a>
</p>

## What is Mailat?

[Mailat](https://github.com/dublyo/mailat) is a full-featured, open-source email platform you can self-host. It includes transactional email sending via AWS SES, a complete inbox with IMAP/SMTP, contacts, campaigns, automations, and more. Deploy it instantly on [Dublyo PaaS](https://dublyo.com) or run it on your own server.

## Prerequisites

- A running [Mailat](https://github.com/dublyo/mailat) instance
  - **Easiest**: One-click deploy on [dublyo.com](https://dublyo.com)
  - **Self-host**: See the [Mailat repo](https://github.com/dublyo/mailat) for Docker setup
- An API key from your Mailat dashboard (**Settings > API Keys**)
- n8n v1.0.0 or later

## Installation

### Community Nodes (Recommended)

In your n8n instance, go to **Settings > Community Nodes > Install** and enter:

```
n8n-nodes-mailat
```

### Manual

```bash
cd ~/.n8n
npm install n8n-nodes-mailat
```

Restart n8n after installing.

## Credential Setup

1. In n8n, go to **Credentials > New Credential > Mailat API**
2. **Base URL** — your Mailat instance URL (e.g., `https://mail.example.com`)
3. **API Key** — your API key starting with `ue_...`
4. Click **Test** to verify the connection

## Nodes

### Mailat (Action Node)

Perform operations on your Mailat instance.

| Resource | Operation | Description |
|----------|-----------|-------------|
| **Email** | Send | Send a transactional email |
| **Email** | Send Batch | Send multiple emails at once |
| **Email** | Get | Get email status and delivery events |
| **Email** | Cancel | Cancel a scheduled email |
| **Inbox** | List | List inbox emails with filtering |
| **Inbox** | Get | Get full email content |
| **Inbox** | Get Thread | Get an email conversation thread |
| **Inbox** | Search | Search inbox by query string |
| **Inbox** | Reply | Reply to an email via compose |
| **Inbox** | Mark Read | Mark emails as read or unread |
| **Inbox** | Delete | Delete emails |
| **Inbox** | Star | Star or unstar emails |
| **Domain** | List | List all configured domains |
| **Domain** | Get | Get domain details and DNS status |
| **Identity** | List | List all email identities |
| **Identity** | Get | Get identity details |

### Mailat Trigger (Webhook Node)

Starts a workflow when an event occurs in Mailat. Select one or more events to listen for.

| Event | Description |
|-------|-------------|
| `email_received` | New email received in inbox |
| `email_sent` | Email sent via transactional API |
| `contact_created` | New contact created |
| `contact_updated` | Contact updated |
| `contact_deleted` | Contact deleted |
| `campaign_sent` | Campaign started sending |
| `bounce_received` | Email bounced (hard or soft) |
| `complaint_received` | Spam complaint received |

## Example Workflows

### Auto-reply to incoming emails

1. **Mailat Trigger** (event: `email_received`)
2. **IF** node — check if subject contains "support"
3. **Mailat** node — Email > Send an auto-reply

### Sync new contacts to your CRM

1. **Mailat Trigger** (event: `contact_created`)
2. **HTTP Request** node — POST contact data to your CRM API

### Bounce alerting

1. **Mailat Trigger** (event: `bounce_received`)
2. **Slack** node — notify your team about the bounce
3. **Mailat** node — look up the contact details

### Forward incoming emails to Slack

1. **Mailat Trigger** (event: `email_received`)
2. **Slack** node — post sender, subject, and preview to a channel

## Compatibility

- n8n v1.0.0+
- Mailat v1.0.0+

## Resources

- [n8n-nodes-mailat on npm](https://www.npmjs.com/package/n8n-nodes-mailat) — install via npm or n8n Community Nodes
- [Mailat on GitHub](https://github.com/dublyo/mailat) — source code, issues, contributions
- [Dublyo PaaS](https://dublyo.com) — deploy Mailat (and 150+ other apps) with one click
- [n8n Community Nodes Docs](https://docs.n8n.io/integrations/community-nodes/)

## Contributing

Found a bug or want a new feature? Open an issue or PR on [GitHub](https://github.com/dublyo/n8n-nodes-mailat).

## License

[MIT](LICENSE)
