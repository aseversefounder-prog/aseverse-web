# AseVerse Design System

## Color Tokens

- `--plum-950`: deep background plum
- `--plum-900`: primary dark plum
- `--plum-800`: elevated plum surface
- `--plum-700`: warm plum accent
- `--gold-500`: primary gold
- `--gold-400`: active gold accent
- `--gold-300`: light gold text
- `--cream-100`: editorial cream surface
- `--cream-200`: secondary cream
- `--charcoal-950`: deepest black/charcoal
- `--charcoal-850`: dark UI surface
- `--ink-700`: cream-mode body text
- `--muted-500`: muted cream-mode support text

## Typography Roles

- Hero title: large editorial serif, used for the main investor message.
- Section title: editorial serif, used for major product moments.
- Story title: editorial serif, used on story cards and detail pages.
- Body text: clean UI sans, used for descriptions and interface copy.
- Caption text: small UI sans, used for metadata and supporting labels.
- Gold accent text: uppercase UI sans, used for section eyebrows and status labels.
- Logo/script accent: handwritten script direction, reserved for the AseVerse mark.

## Reusable Components

- Story card: image-led repeated card with title, description, narrator, duration, and progress.
- Audio player: glowing player with cover, title, narrator, controls, progress, and mode label.
- Continue reading/listening card: compact progress-forward story surface.
- Navigation bar: sticky demo route with Browse, Dual, Community, and Creator.
- Creator stats card: repeated metric block for reads, listens, revenue, and requests.
- Upload panel: creator-safe form surface with encouraging microcopy.
- Profile chip/avatar: circular identity marker for comments and community.
- Badge component: gold/cream achievement direction from mockups.
- Comment card: book-club/social reaction unit with user, quote, and engagement signal.
- Book club card: future extension of comment/community surfaces.

## Current Implementation

The static prototype implements the system in `styles.css`, using CSS custom properties as product tokens and shared classes for repeated UI patterns.
