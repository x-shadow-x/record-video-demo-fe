import React, { useEffect, useRef } from 'react';
import './App.css';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import 'webrtc-adapter';
import RecordRTC from 'recordrtc';
import 'videojs-record/dist/css/videojs.record.css';
import 'videojs-record/dist/videojs.record.js';

const isIOSChrome = () => {
  const agent = navigator.userAgent;
  const isIOS = !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  const isChrome = agent.toLocaleLowerCase().indexOf("crios") >= 0
  return isIOS && isChrome
}

console.info(isIOSChrome(), '=============isIOSChrome')

let player: any
const saveBlob = (blob: any, fileName: string) => {
  var a: any = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";

  var url = window.URL.createObjectURL(blob);
  // return url
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

const uploadData = (data: any) => {
  const formData = new FormData();
  formData.append('upl', data, data.name);
  console.log('uploading recording:', data.name);
  fetch("https://192.168.31.80:8889/api/test", {
    method: 'POST',
    body: formData,
  }).then(
    success => {
      console.log('recording upload complete.')
    }
  ).catch(
    error =>{
      console.error('an upload error occurred!');
      console.info(error)
    }
  );
}
console.info(saveBlob)
console.info(window.WritableStream, '==============window.WritableStream')

function App(props: any) {
  const videoEl = useRef(null);
  useEffect(() => {
    if(videoEl?.current) {
      console.info(props, '1111111111')
      player = videojs(videoEl.current, props, () => {
        // print version information at startup
        const version_info = `Using video.js ${videojs.VERSION} with videojs-record ${videojs.getPluginVersion('record')} and recordrtc ${RecordRTC.version}`;
        videojs.log(version_info);
      })

      // device is ready
      player.on('deviceReady', () => {
        console.info(123123)
        console.log('device is ready!');
      });

      // user clicked the record button and started recording
      player.on('startRecord', () => {
        console.log('started recording!');
      });

      // user completed recording and stream is available
      player.on('finishRecord', () => {
        // recordedData is a blob object containing the recorded data that
        // can be downloaded by the user, stored on server etc.
        console.log('finished recording: ' + player.recordedData);
        const data = player.recordedData;
        uploadData(data)
        
      });

      // player.on('finishRecord', () => {
      //   // recordedData is a blob object containing the recorded data that
      //   // can be downloaded by the user, stored on server etc.
      //   console.log('finished recording: ' + player.recordedData);
      //   player.record().saveAs({'video': 'my-video-file-name.webm'});
      // });
      

      // error handling
      player.on('error', (_element: any, error: Error) => {
        console.warn(error);
      });

      player.on('deviceError', (error: Error) => {
        console.info(player.deviceErrorCode, '========player.deviceErrorCode')
        console.error('device error:', error);
      });
    }
  }, [videoEl, props])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    uploadData(file)
  }
  return isIOSChrome() ?
    <input type="file" id='video' accept="video/*" capture='camera' onChange={handleChange} />
    : <div data-vjs-player>
      <video id="myVideo" ref={videoEl} className="video-js vjs-default-skin" playsInline></video>
    </div> 
}

export default App;
