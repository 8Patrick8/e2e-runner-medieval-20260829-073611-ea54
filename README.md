# Mittelalter-Endless-Runner

Ein simples 2D-Endless-Runner-Browserspiel im Mittelalter-Stil: Ein Ritter läuft
automatisch, springt per Leertaste oder Klick/Tap über Fässer und Zäune, das
Tempo steigt mit der Zeit, Punkte gibt es nach Distanz, der Highscore bleibt in
LocalStorage erhalten, dazu ein parallax scrollender Hintergrund sowie Start- und
Game-Over-Screen.

## Tech-Stack

- **Sprache**: JavaScript (Vanilla, ES-Module)
- **Build**: Vite
- **Rendering**: HTML5 Canvas 2D
- **Speicherung**: LocalStorage

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Öffne anschließend die angezeigte URL (standardmäßig `http://localhost:5173`).

## Build für Produktion

```bash
npm run build
```

Die gebauten Dateien liegen in `dist/`. Zum lokalen Ausliefern des Builds:

```bash
npm run preview
```

## Steuerung

- **Leertaste** oder **Klick/Tap** – Spiel starten, springen, neu starten.
- Der Ritter springt nur, wenn er auf dem Boden steht; nach der Landung kann er
  erneut springen.

## Features

- Automatisch laufender Ritter mit Sprungphysik (Schwerkraft, Bodenkollision)
- Prozedural erzeugte Hindernisse (Fässer und Zäune), die von rechts nach links scrollen
- Kollisionserkennung mit Game-Over-Übergang
- Tempo-Anstieg und distanzbasierter Punktestand, live im HUD
- Highscore in LocalStorage, validiert und persistent
- Parallax scrollender Mittelalter-Hintergrund (Himmel, Hügel, Burg, Boden)
- Start- und Game-Over-Screen
