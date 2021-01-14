import React from 'react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { message  } from 'antd';
import { reject } from 'lodash';

export default class EditorDemo extends React.Component {
    state = {
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(null)
    }
 
    async componentDidMount() {
        var _self = this
        this.setState({
            editorState: BraftEditor.createEditorState(this.props.val)
        })
    }
    render() {
        const { editorState } = this.state
        const controls = [
            'undo', 'redo', 'separator',
            'font-size', 'line-height', 'letter-spacing', 'separator',
            'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
            'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
            'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
            'link', 'separator', 'hr', 'separator',
            'media', 'separator',
            'clear'
        ]

        const myUploadFn = (param) => {
            console.log(param)
 
            const serverURL = "/v1/upload/file";
            const xhr = new XMLHttpRequest
            const fd = new FormData()
          
            const successFn = (response) => {
              // 假设服务端直接返回文件上传后的地址
              // 上传成功后调用param.success并传入上传后的文件地址
              console.log("xhr",xhr);
              param.success({
                url: JSON.parse(xhr.responseText).data.url,
                meta: {
                  id: 'img' + Math.random()*10,
                  title: '上传文件',
                  alt: '上传文件',
                  loop: true, // 指定音视频是否循环播放
                  autoPlay: true, // 指定音视频是否自动播放
                  controls: true, // 指定音视频是否显示控制栏
                  poster: 'http://xxx/xx.png', // 指定视频播放器的封面
                }
              })
            }
          
            const progressFn = (event) => {
              // 上传进度发生变化时调用param.progress
              param.progress(event.loaded / event.total * 100)
            }
          
            const errorFn = (response) => {
                console.log(response)
              // 上传发生错误时调用param.error
              param.error({
                msg: '上传失败！'
              })
            }
          
            xhr.upload.addEventListener("progress", progressFn, false)
            xhr.addEventListener("load", successFn, false)
            xhr.addEventListener("error", errorFn, false)
            xhr.addEventListener("abort", errorFn, false)
          
            fd.append('filename', param.file)
            fd.append('is_image', 1)
            xhr.open('POST', serverURL, true)
            xhr.send(fd)
         // console.log("xhr",xhr);
        }

        //  校验不通过的媒体文件将不会被添加到媒体库中
        const myValidateFn = (file) => {
            console.log(file)
            
            if(file.size / (1024 * 1024) > 20){
                message.warn("上传的文件大于20M，请选择小于20M的文件！")
            }
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    file.size < 1024 * 1024 * 20 ? resolve() : reject()
                }, 2000)
            })
        }

        // 指定媒体库允许选择的本地文件的MIME类型
          const myUploadaccepts = {
            image: 'image/png,image/jpeg,image/jpg,image/gif,image/webp,image/apng,image/svg',
            video: 'video/mp4',
            audio: 'audio/mp3'
          }

 
        return (
            <div style={{ width: this.props.width, height: this.props.height || '100px', display: 'inline-block', margin: "0px 10px 10px 0px", lineHeight: '24px' }} >
                <BraftEditor
                    defaultValue={this.props.val}
                    media={{uploadFn: myUploadFn, validateFn: myValidateFn, accepts: myUploadaccepts, pasteImage: true}}
                    value={editorState}
                    onChange={this.handleChange}
                    onSave={this.submitContent}
                />
            </div>
 
        )
    }
    handleChange = (editorState) => {
        const htmlString = editorState.toHTML()
        this.setState({ editorState: editorState }, () => {
            this.props.onChange(htmlString)
        })
    }
}