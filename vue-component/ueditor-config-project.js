import { UEDITOR_BASE_URL } from './constants'

export default {
  UEDITOR_HOME_URL: UEDITOR_BASE_URL,
  // 服务器统一请求接口路径
  serverUrl: '/api/ueditor',
  autoHeightEnabled: false,
  autoFloatEnabled: false,
  initialFrameWidth: '100%',
  initialFrameHeight: 200,
  minFrameHeight: 150,
  elementPathEnabled: false,
  maximumWords: 5000,
  enableAutoSave: false, // 无效。。。
  saveInterval: 90000000,
  compressSide: 1, // 根据宽度来
  maxImageSideLength: 2160, // 庙街的图片要求质量高
  zIndex: 200, // backdrop是10001, 文件上传组件是101
  catchRemoteImageEnable: false,
  /* eslint-disable */
  toolbars: [
    ["fullscreen", "source", "undo", "redo", "insertunorderedlist", "insertorderedlist", "unlink", "link", "print", "preview", "searchreplace",
     "|", "insertimage", "emotion", "map", "horizontal", "blockquote", "bold", "italic", "underline", "fontborder", "strikethrough", "forecolor",
     "backcolor", "justifyleft", "justifyright", "justifycenter", "justifyjustify", "indent", "formatmatch", "removeformat", "autotypeset", "paragraph",
     "rowspacingbottom", "rowspacingtop", "lineheight", "fontfamily", "fontsize", "imagenone", "imageleft", "imageright", "imagecenter", "inserttable",
     "deletetable", "mergeright", "mergedown", "splittorows", "splittocols", "splittocells", "mergecells", "insertcol", "insertrow", "deletecol", "deleterow",
     "insertparagraphbeforetable", "charts"
   ]
  ],
  /* eslint-enable */
}
