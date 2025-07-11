declare module 'quill-image-resize-module-react' {
  import { QuillModule } from 'quill'

  interface ImageResizeModule extends QuillModule {
    options: {
      modules: string[]
      parchment: any
    }
  }

  const ImageResize: ImageResizeModule
  export default ImageResize
}
