import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-piano',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './piano.component.html',
  styleUrl: './piano.component.css'
})
export class PianoComponent {
  whiteKeys = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
  blackKeys = ['Do#', 'Re#', null, 'Fa#', 'Sol#', 'La#', null];
  octaves = Array(4); // 7 octaves: 1 to 7

  @Input() activeNote: string | null = null;
  @Input() correctNote: string | null = null;
  @Input() success: boolean = false;

  @Output() clickedNote = new EventEmitter<string>();

  isCorrect(key: string, octave: number): boolean {
    return this.correctNote === key + octave && this.success;
  }

  isActive(key: string, octave: number) {
    return this.activeNote == key + octave;
  }
  onClickKey(note: string, octave: number) {
    this.clickedNote.emit(note + octave);
  }
}
