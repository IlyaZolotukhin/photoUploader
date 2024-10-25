import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css'],
  imports: [
    NgIf,
    AsyncPipe
  ],
  standalone: true
})
export class PhotoUploadComponent {
  selectedFile: File | null = null;
  uploadPercent!: Observable<number | undefined>;

  constructor(private storage: AngularFireStorage) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      const filePath = `images/${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      this.uploadPercent = this.storage.upload(filePath, this.selectedFile).percentageChanges();
      fileRef.getDownloadURL().subscribe(url => {
        console.log('File available at', url);
      });
    }
  }
}
