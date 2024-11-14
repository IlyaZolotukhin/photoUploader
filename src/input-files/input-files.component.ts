import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import type {TuiFileLike} from '@taiga-ui/kit';
import {TuiFiles} from '@taiga-ui/kit';
import {FileService} from "../services/file.service";
import {TuiLabel, TuiTextfieldComponent, TuiTextfieldDirective} from "@taiga-ui/core";
import {File} from "../photo-upload/photo-upload.component";

@Component({
  selector: 'app-input-files',
  standalone: true,
  exportAs: "app-input-files",
  imports: [AsyncPipe, NgIf, ReactiveFormsModule, TuiFiles, TuiTextfieldComponent, TuiLabel, TuiTextfieldDirective],
  templateUrl: './input-files.component.html',
  styleUrls: ['./input-files.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InputFilesComponent {
  selectedFile: File | null = null;

  constructor(private fileService: FileService) {
    this.form.get('text')?.valueChanges.subscribe((textValue) => {
        this.fileService.setSelectedFile(this.selectedFile, textValue);
    });
  }

  protected readonly control = new FormControl<TuiFileLike | null>(null);

  protected readonly form = new FormGroup({
    picture: this.control,
    text: new FormControl(''),
  });

  protected removeFile(): void {
    this.control.setValue(null);
    this.selectedFile = null;
    this.fileService.setSelectedFile(null, '');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      this.control.setValue(file);
      const textValue = this.form.get('text')?.value ?? '';

      this.fileService.setSelectedFile(file, textValue);
    }
  }
}
