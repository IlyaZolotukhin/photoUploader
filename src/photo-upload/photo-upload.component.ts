import {Component, OnInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {catchError, Observable, of} from 'rxjs';
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {map} from "rxjs/operators";
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {ReactiveFormsModule} from "@angular/forms";
import {FileService} from "../services/file.service";

export interface File {
  name: string;
}

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css'],
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  standalone: true,
})

export class PhotoUploadComponent implements OnInit {
  selectedFile: File | null = null;
  uploadPercent!: Observable<number | undefined>;
  uploadFiles?: any[] = [];

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private fileService: FileService,
  ) {}
//метод жизненного цикла, запускает fetchFiles после инициализации всех свойств компонента
  ngOnInit(): void {
    this.fileService.selectedFile$.subscribe(file => {
      this.selectedFile = file;
      console.log('выбранный файл из PhotoUploadComponent:', this.selectedFile);
    });

    this.fetchFiles();
  }
//метод возвращает список из последних 20 файлов из базы данных firebase
  getFiles() {
    return this.db.list('files', ref => ref.limitToLast(20));
  }
//метод для загрузки файлов
  fetchFiles(): void {
    //вызывает getFiles(), чтобы получить список файлов
    //оператор snapshotChanges() для получени изменений в реальном времени
    // инутри pipe() происходит обработка данных с помощью оператора map()
    this.getFiles().snapshotChanges().pipe(
      //map() для каждого файла извлекает значение (val) и ключ (key)
      map(changes =>
        changes.map(c => {
          const val = c.payload.val();
          return {
            //если значение является объектом и не равно null, оно добавляется в новый объект вместе с ключом
            // получается массив объектов, где каждый объект представляет файл с его ключом и значениями
            key: c.payload.key,
            ...(typeof val === 'object' && val !== null ? val : {})
          };
        })
      ),
      //обработаем ошибку если error есть
      catchError(error => {
        console.error('Error fetching files:', error);
        //и вернем пустой массив
        return of([]);
      })
      //с помощью метода subscribe() подписываемся на поток данных.
      // если данные успешно загружены и обработаны, они присваиваются переменной uploadFiles, кот. использую в HTML
    ).subscribe(fileUploads => {
      this.uploadFiles = fileUploads;
    });
  }
//зарузка файла на сервер firebase
  uploadFile() {
    if (this.selectedFile) {
      const filePath = `files/${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      this.uploadPercent = this.storage.upload(filePath, this.selectedFile).percentageChanges();
      this.storage.upload(filePath, this.selectedFile).snapshotChanges().pipe(
        catchError(error => {
          console.error('Upload error:', error);
          return of(null);
        })
      ).subscribe(snapshot => {
        if (snapshot?.state === 'success') {
          fileRef.getDownloadURL().subscribe(url => {
            console.log('File available at', url);
            this.db.list('files').push({ name: this.selectedFile?.name, url });
          });
        }
      });
    }
  }
  // Метод для удаления файла из базы данных
  deleteFile(key: string): void {
    this.db.list('files').remove(key).then(() => {
      console.log(`File with key ${key} deleted successfully`);
    }).catch(error => {
      console.error('Error deleting file:', error);
    });
  }

}
