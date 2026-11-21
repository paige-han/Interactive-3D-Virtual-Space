# Film Previs — exploration notes

> Branch: `explore/film-previs` · Status: **work in progress**

## Why

Before moving into design and engineering, I worked on film sets and in TV drama production. On set, I saw how much of a shoot day depends on decisions made beforehand: which lens, where the camera stands, how the actors move through the frame. Those decisions were usually communicated through sketches, reference photos and a lot of explaining — and changing them on the day was expensive.

**Previsualization (previs)** is how crews plan those shots in a rough 3D version of the set. Professional previs usually happens in game engines like Unreal, which takes specialist skills and software that most of the crew doesn't have.

This exploration asks a narrower question: **what would a lightweight, link-shareable shot-planning tool look like if it lived in the browser** — something a director, DP or production designer could open on a laptop or phone without installing anything? As a designer, I'm especially interested in making it speak the crew's language — millimeters, frame lines, shot sizes — rather than 3D-software terms.

## Step 1 — A camera that behaves like a real one ✅

![Through the lens](through-the-lens.jpg)

- **Real lenses instead of "zoom."** Pick a focal length (18–135mm) and a sensor (Super 35, Full Frame, Micro 4/3). The field of view is calculated the way it is on set:

  `horizontal angle of view = 2 · atan(sensor width / (2 · focal length))`

  So a 50mm lens on Super 35 frames tighter than the same 50mm on Full Frame — the "crop factor" falls out of the math.
- **Frame lines.** Letterbox masks for 2.39:1, 1.85:1, 16:9 and 4:3, plus a rule-of-thirds grid. The lens math is mapped to the *framed* area, not the browser window, so what's inside the frame lines matches the real lens.
- **Director's view vs. through the lens.** Step outside to see where the camera is standing and what its frustum covers, then look through it.
- **Shot presets.** Wide, Medium, Close-up and Low angle, defined by lens, distance, camera height and aim height on the actor.

| Close-up · 85mm | Director's view |
|---|---|
| ![Close-up](close-up-85mm.jpg) | ![Director's view](directors-view.jpg) |

## Roadmap

- [x] Real-lens virtual camera (focal length + sensor size)
- [x] Aspect-ratio frame lines and rule of thirds
- [x] Director's view with visible camera and frustum
- [ ] **Depth of field by f-stop** — focus distance + aperture instead of abstract blur values
- [ ] **Lighting setups** — key / fill / rim presets and a time-of-day sun
- [ ] **Shot list** — save camera setups as Shot 1, 2, 3… and export frames as a storyboard
- [ ] **Camera moves** — dolly, pan and crane on a simple keyframe timeline
- [ ] **Actor blocking** — mark positions and walk the character along a path
- [ ] **Phone as a virtual camera** — use the device gyroscope to frame shots handheld

## Run it

```bash
npm install
npm run dev
```

Open `/previs.html` on the local URL Vite prints.
