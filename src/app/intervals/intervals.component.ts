import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { PianoComponent } from '../piano/piano.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-intervals',
  standalone: true,
  imports: [PianoComponent, NgIf],
  templateUrl: './intervals.component.html',
  styleUrl: './intervals.component.css'
})
export class IntervalsComponent implements OnInit {

  constructor() {}

  showInstructions = true;  // control collapsible visibility

  notes = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
  octaves = ["1","2","3", "4"];
  globalNotes: string[] = [];

  currentNote: string | null = null;
  currentPath: string | null = null;

  secondNote: string | null = null;
  secondNotePath: string | null = null;

  clickedNote: string | null = null;

  success: boolean = false;

  correctAnswers: number = 0;
  wrongAnswers: number = 0;
  winrate: string = "";

  ngOnInit() {
    this.loadNotes();
  }

  getPath(note: string, octave: string) {
    return `../assets/PianoKeys/Piano${note}${octave}.mp3`;
  }

  getPathFromFullNote(note: string) {
    const part1 = note.slice(0, -1);
    const part2 = note.slice(-1);
    return this.getPath(part1, part2);
  }

  playAudio(path: string) {
    const audio = new Audio(path);
    audio.play();
  }

  async loadNotes() {
    for (const octave of this.octaves) {
      for (const note of this.notes) {
        const audioFilePath = this.getPath(note, octave);

        const response = await fetch(audioFilePath, { method: 'HEAD' });
        if (response.ok) {
          const audio = new Audio(audioFilePath);
          audio.preload;
          audio.load();   //Chargement des samples audio
          this.globalNotes.push(note + octave);
          }
      }
    }
  }

  randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  playNote() {
    // Clear previous attempt
    this.secondNote = null;
    this.secondNotePath = null;
    this.success = false;
    // randomize the first note to play
    const note = this.notes[this.randInt(0,6)];
    const octave = this.octaves[this.randInt(0,3)];

    const audioFilePath = this.getPath(note, octave);
    this.currentPath = audioFilePath;
    this.currentNote = note + octave;

    console.log(this.currentNote + ' - ' + this.currentPath);
    this.playAudio(this.currentPath);
  }

  replay() {
    if (this.currentPath) this.playAudio(this.currentPath);
  }

  generateAndPlaySecondNote() {
    if (this.currentNote == null) return;

    // randomize the interval between +1 and -1 octave until the note is within bounds
    let interval = this.randInt(-7, 7);
    let index = this.globalNotes.findIndex(n => n === this.currentNote);
    while(index + interval < 0 || index + interval > this.globalNotes.length) {
      console.log("Out of bounds");
      interval = this.randInt(-7, 7);
      index = this.globalNotes.findIndex(n => n === this.currentNote);
    }
    console.log("Within bounds");
    this.secondNote = this.globalNotes[index + interval];
    console.log(this.secondNote);
    this.secondNotePath = this.getPathFromFullNote(this.secondNote)
    this.playAudio(this.secondNotePath);
    
  }

  replaySecondNote() {
    if (this.secondNotePath) this.playAudio(this.secondNotePath);
  }

  checkNote(note: string) {
    if (this.currentNote == null || this.secondNote == null) return;
    this.clickedNote = note;

    if (this.clickedNote == this.secondNote) {
      this.success = true;
      this.replaySecondNote();
      this.correctAnswers += 1;
    }
    else {
      this.success = false;
      this.playAudio(this.getPathFromFullNote(note))
      this.wrongAnswers += 1;
    }
    this.updateWinrate();
  }

  updateWinrate() {
    if (this.correctAnswers + this.wrongAnswers == 0 ) {
      this.winrate = '';
    }
    else {
      this.winrate = this.correctAnswers / (this.correctAnswers + this.wrongAnswers) * 100 + '%'; 
    }
  }

  hardReset() {
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.winrate = '';
    this.currentNote = null;
    this.currentPath = null;
    this.secondNote = null;
    this.secondNotePath = null;
  }

  // Keyboard shortcuts
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch(event.key.toLowerCase()) {
      case 'a':  // Play note
        this.playNote();
        break;
      case 'z':  // Replay note
        this.replay();
        break;
      case 'q':  // Generate second note
        this.generateAndPlaySecondNote();
        break;
      case 's':  // Replay second note
        this.replaySecondNote();
        break;
      case 'r' : // Reset
      this.hardReset;
      break;  
    }
  }
}
