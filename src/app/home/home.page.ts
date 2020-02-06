import { Component, ViewChild } from '@angular/core';
import { ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview/ngx';
import { Platform, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('imageCropper', {static: false}) imageCropper: ImageCropperComponent;
  @ViewChild('slides', {static: false}) slides: IonSlides;

  images = [];
  modified: string;
  slideOpts: any;
  cropperActive = false;
  disableCropper = false;
  rotation = 0;

  disableBtn = false;
  imageSelectedIndex = -1;
  
  transform: ImageTransform = {};

  constructor(
    private cameraPreview: CameraPreview,
    public platform: Platform
  ) { 
    this.transform = {
      rotate: 0,
      scale: 1
    };
  }

  ngOnInit() {
    let slidesPerView = this.platform.width() / 66;

    this.slideOpts = {
      slidesPerView: slidesPerView,
      spaceBetween: 12,
      slidesOffsetBefore: 18,
      slidesOffsetAfter: 18
    };

    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: 'rear',
      tapPhoto: true,
      previewDrag: true,
      toBack: true,
      alpha: 1
    };

    // start camera
    this.cameraPreview.startCamera(cameraPreviewOpts).then(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }
    );
  }

  takePicture() {
    this.disableBtn = true;

    const pictureOpts: CameraPreviewPictureOptions = {
      width: 1280,
      height: 1280,
      quality: 85
    }

    this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
      let picture = 'data:image/jpeg;base64,' + imageData;

      let output = {
        active: picture,
        original: picture
      };

      this.images.push(output);
      this.disableBtn = false;

      setTimeout(() => {
        this.imageSelectedIndex = this.images.length - 1;
      }, 170);

      if (this.images.length > 1) {
        setTimeout(() => {
          this.slides.slideTo(this.images.length - 1);
        }, 80);
      }
    }, (err) => {
      this.disableBtn = false;
    });
  }

  changeCamera() {
    this.disableBtn = true;
    this.cameraPreview.switchCamera();
    this.disableBtn = false;
  }

  selectImage(index: number) {
    this.transform = {
      rotate: 0,
      scale: 1
    };

    this.imageSelectedIndex = index;
  }

  updateRotation() {
    this.transform = {
        ...this.transform,
        rotate: this.rotation
    };
  }

  restoreOriginal() {
    this.images[this.imageSelectedIndex].active = this.images[this.imageSelectedIndex].original;
  }

  imageCropped(event: any) {
    this.modified = event.base64;
  }

  save() {
    this.images[this.imageSelectedIndex].active = this.modified;
    this.cropperActive = false;

    setTimeout(() => {
      this.transform = {
        rotate: 0,
        scale: 1
      };

      this.modified = null;
    }, 50);
  }

  cancel() {
    this.transform = {
      rotate: 0,
      scale: 1
    };

    this.cropperActive = false;
  }
}
