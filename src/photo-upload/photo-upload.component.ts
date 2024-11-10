import {Component, OnInit, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {catchError, Observable, of} from 'rxjs';
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {map} from "rxjs/operators";
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {FileService} from "../services/file.service";
import {TuiAlertService, TuiButton, TuiDialog, TuiLoader} from "@taiga-ui/core";
import {TuiInputModule} from "@taiga-ui/legacy";
import {TuiAutoFocus} from "@taiga-ui/cdk";
import InputFilesComponent from "../input-files/input-files.component";
import {TuiButtonClose, TuiProgressBar} from "@taiga-ui/kit";

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
    ReactiveFormsModule,
    TuiButton,
    TuiDialog,
    TuiInputModule,
    TuiAutoFocus,
    InputFilesComponent,
    TuiButtonClose,
    TuiLoader,
    TuiProgressBar
  ],
  standalone: true,
})

export class PhotoUploadComponent implements OnInit {
  selectedFile: File | null = null;
  selectedImage: any;
  uploadPercent!: Observable<number | undefined>;
  uploadFiles?: any[] = [];
  protected open = false;
  protected openImg = false;
  loadButton: boolean = false;
  private readonly alerts = inject(TuiAlertService);

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private fileService: FileService,
  ) {}

//метод жизненного цикла, запускает fetchFiles после инициализации всех свойств компонента
  ngOnInit(): void {
    //загрузка при инициализации
    this.fetchFiles();
    //получаем при инициализации выбранный файл
    this.fileService.selectedFile$.subscribe(file => {
      this.selectedFile = file;
    });
  }

  protected showDialog(): void {
    this.open = true;
  }

  protected showImage(file: any): void {
    this.openImg = true;
    this.selectedImage = file;
  }

  protected clearSelectedFile(): void {
    this.selectedFile = null;
  }
//метод возвращает список из последних 20 файлов из базы данных firebase
  getFiles() {
    return this.db.list('files', ref => ref.limitToLast(20));
  }
//метод для загрузки файлов
  fetchFiles(): void {
    // Вызывает getFiles(), чтобы получить список файлов
    this.getFiles().snapshotChanges().pipe(
      //оператор snapshotChanges() для получени изменений в реальном времени
      // инутри pipe() происходит обработка данных с помощью оператора map()
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
        }).reverse() // Добавляем оператор reverse() для изменени порядка загрузки
      ),
      // Обработка ошибки
      catchError(error => {
        console.error('Error fetching files:', error);
        // и вернем пустой массив
        return of([]);
      })
    ).subscribe(fileUploads => {
      //с помощью метода subscribe() подписываемся на поток данных.
      // если данные успешно загружены и обработаны, они присваиваются переменной uploadFiles, кот. использую в HTML
      this.uploadFiles = fileUploads;
    });
  }
//зарузка файла на сервер firebase
  uploadFile() {
    this.loadButton = true;
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
            this.db.list('files').push({ name: this.selectedFile?.name, url });
            this.alerts
              .open('Изображение, <strong> теперь видят другие пользователи</strong>', {label: 'Поздравляю!'})
              .subscribe();
            this.loadButton = false;
            this.open = false;
            this.selectedFile = null;
          });
        }
      });
    }
  }
  // Метод для удаления файла из базы данных
  deleteFile(key: string): void {
    this.db.list('files').remove(key).then(() => {
      this.alerts
        .open('Изображение, <strong>удалено с сервера</strong>', {label: 'Очень жаль!'})
        .subscribe();
      this.openImg = false;
      console.log(`File с ключом ${key} удалён успешно`);
    }).catch(error => {
      console.error('Error deleting file:', error);
    });
  }
}
