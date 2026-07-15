# Shubpy Demo Site ("Lumio")

A standalone Next.js marketing site for a fictional analytics company. Its only
job is to **embed the Shubpy chat + bot widget the way a real customer would** —
one `<script>` tag — so you can run an end-to-end client demo:

> visitor lands on a normal website → opens chat → bot answers → bot hands off
> → conversation appears in the dashboard **queue** → admin assigns → agent
> replies live.

## 1. Configure

Open [`app/layout.tsx`](app/layout.tsx) and fill in the three constants at the
top of the file:

```ts
const WORKSPACE_KEY = "";           // Dashboard → Organisation → Widget
const API_BASE      = "http://localhost:8000";
const WIDGET_SRC    = "http://localhost:3000/widget.js";
```

That's it — no env files, no build step config. Just like a real customer
would paste the snippet.

## 2. Run

```bash
npm install
npm run dev      # http://localhost:4000
```

Run it alongside the platform:

- backend API + WS on `:8000`
- dashboard frontend on `:3000` (serves `/widget.js`)
- this demo site on `:4000`

## 3. Demo script (what to show the client)

1. **Open the demo site** at `http://localhost:4000`. It's a normal marketing
   page — point out the chat launcher bottom-right is the *only* integration.
2. **Publish a bot** in the dashboard (flow editor → Publish) with trigger
   *New conversation*. No published bot ⇒ the visitor goes straight to the
   agent queue (also a valid thing to show).
3. **Chat as the visitor**: open the bubble, send a message, walk the bot flow
   / quick replies, then trigger the hand-off node.
4. **Switch to the dashboard** (`/ins/<instance>/queue`): the handed-off
   conversation now appears **in real time** — no refresh, no 30s wait.
5. **Assign it** from the queue (to an agent or team). It leaves the queue
   instantly and lands in the assigned agent's **Conversations** list.
6. **Reply as the agent**; messages, typing indicators and close all stream
   live back to the widget on the demo site.

## 4. Notes

- The widget `<Script>` tag lives directly in [`app/layout.tsx`](app/layout.tsx) —
  the rest of the app is plain marketing content on purpose.
- Returning visitors resume their session (`localStorage`), so use the widget's
  reset or a fresh incognito window to demo a brand-new visitor.
