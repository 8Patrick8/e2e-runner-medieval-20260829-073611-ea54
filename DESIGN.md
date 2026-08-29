# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Warme Retro-Dämmerungspalette mit Pergament-Akzenten und harten Silhouetten: ruhig, erdig und wie ein kleines Pixel-Mittelalterspiel, durchgehend mit dunklen Outlines für maximale Lesbarkeit auf Canvas.

## Colors

- `--color-bg`: **#232b3b**
- `--color-fg`: **#f4e9d6**
- `--color-accent`: **#e05d3a**
- `--color-border`: **#2f2a26**
- `--color-muted`: **#8b99a6**
- `--color-sky_top`: **#2a3350**
- `--color-sky_horizon`: **#c98a5b**
- `--color-hill_far`: **#5b6472**
- `--color-hill_near`: **#3f4a3a**
- `--color-castle`: **#2e3440**
- `--color-wood`: **#8a5a3b**
- `--color-wood_dark`: **#5e3b28**
- `--color-wood_light`: **#a9744f**
- `--color-steel`: **#b8c0c8**
- `--color-steel_dark`: **#7d8a96**
- `--color-ground`: **#4a3b30**
- `--color-ground_dark`: **#332821**

## Typography

- `font_family`: 'Georgia', 'Times New Roman', serif
- `font_ui`: 'Segoe UI', 'Trebuchet MS', system-ui, sans-serif
- `heading_weight`: 700
- `body_weight`: 400

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 16px
- `--radius-pill`: 999px

## Components

### Button

Primär-Button (DOM-Overlay oder Canvas-Klickfläche): padding 12px 24px, radius md, bg=accent #e05d3a, fg=#f4e9d6, border 2px #2f2a26; hover=accent +10% Helligkeit, active=1px nach unten + accent -8%, disabled=opacity 0.6; min-height 44px; font_ui, weight 700, Text zentriert.

### Sprite — Ritter (Spieler)

Logische Größe 32×48 px (Hitbox 24×40, Füße auf Bodenlinie). Einfaches Pixel-Sprite mit 2px Outline #2f2a26: Helm 12×12 steel #b8c0c8 mit steel_dark-Schattierung und 4px accent-Federbusch, Körper/Wams 16×18 accent #e05d3a mit dunklerer Faltenlinie, Beine je 6×10 ground #4a3b30, Stiefel 2px ground_dark. Lauf-Animation 2 Frames: Beine 4px versetzt, Körper 2px Hüpfbewegung. Silhouette sofort als Ritter lesbar, keine einfarbige Fläche.

### Sprite — Fass (Hindernis)

Logische Größe 28×32 px, 2px Outline #2f2a26. Zylinder: Dauben wood #8a5a3b, seitliche Schattierung wood_dark #5e3b28, Lichtkante wood_light #a9744f; zwei Metallreifen steel #b8c0c8 (je 3px) oben und unten. Silhouette eindeutig Fass.

### Sprite — Zaun (Hindernis)

Logische Größe 36×28 px, 2px Outline #2f2a26. Zwei spitze Pfosten (je 8×28) und zwei Querlatten (36×6) aus wood #8a5a3b mit wood_dark-Kanten und wood_light-Lichtkante. Silhouette eindeutig Zaun.

### Hintergrund — Himmel

Vertikaler Verlauf sky_top #2a3350 → sky_horizon #c98a5b über die oberen 70% der Canvas-Höhe; 2–3 Wolken muted #8b99a6 mit 30% Alpha, Parallax-Faktor 0.08.

### Hintergrund — Burg & Hügel

Drei Parallax-Ebenen in Silhouetten-Stil mit harten Kanten: fern Hügel hill_far #5b6472 (Faktor 0.15), Burg castle #2e3440 mit 2–3 Türmen und Zinnen (Faktor 0.25, auf Mittellinie), nah Hügel hill_near #3f4a3a (Faktor 0.35).

### Hintergrund — Boden

Boden ab 78% der Canvas-Höhe: ground #4a3b30, obere Kante 2px ground_dark, einzelne 4–6px Steine/Pflaster in ground_dark/wood_dark, scrollt mit Faktor 1.0 (Spielgeschwindigkeit).

### HUD

Oben links Punktestand, oben rechts Highscore; 16px Abstand vom Rand; font_ui 18px/700, fg #f4e9d6 mit 2px Outline #2f2a26 oder Halbtransparenz-Kachel rgba(35,43,59,0.55) radius sm; Label 'BEST' muted #8b99a6. Über jedem Hintergrund lesbar.

### Screen — Start

Overlay rgba(35,43,59,0.55) über Spielszene; zentriert: Titel 'Mittelalter-Endless-Runner' font_family 40px/700 fg mit dunklem Schatten, Untertitel 'Leertaste oder Klick/Tap' muted 18px, Highscore-Zeile falls vorhanden, pulsierender CTA (Button-Spez). Settings/Level-Select entfallen (Out of Scope).

### Screen — Game Over

Overlay rgba(35,43,59,0.65); zentriert: 'Game Over' accent 44px/700 mit Outline, Punktestand fg 24px, Highscore fg 18px (bei Rekord: accent + 'NEUER REKORD'), Hinweis 'Neustart: Leertaste oder Klick' muted 18px.

## Layout Principles

- Logische Canvas-Auflösung 960×540, proportional auf den Viewport skaliert (letterboxing), Bodenlinie bei 78% der Höhe.
- Breakpoints: <640px HUD-Schrift 14px, Titel 28px, Klick-/Touch-Zonen ≥44px; ≥960px volle Größen; Container/Overlay max-width 1280px zentriert.
- Ritter ruht bei x = 22% der Breite; Hindernisse spawnen rechts außerhalb und scrollen nach links; Kollision über Hitboxen (Ritter 24×40, Fass 24×28, Zaun 32×24).
- Parallax-Faktoren: Wolken 0.08, Hügel fern 0.15, Burg 0.25, Hügel nah 0.35, Boden 1.0; Vordergrund immer dunkler und gesättigter als Hintergrund.
- Lesbarkeit: alle Spielfiguren mit 2px Outline #2f2a26; Spieler accent/steel hebt sich von braunem Boden und blauem Himmel ab; Text nie ohne Outline oder dunkle Halbtransparenz-Kachel.
