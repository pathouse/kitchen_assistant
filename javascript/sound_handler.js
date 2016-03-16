(function () {
  var SoundHandler = function () {
    this.alarmReady = false
    this._getAudioContext()
    this._loadAlarmAudio();
  }

  SoundHandler.prototype.play = function (paths) {
    if (!paths) { return }
    var path = paths.shift()
    if (!path) {
      this.audioSource = null;
      return
    }
    var onLoad = function (buffer) {
      this._playBuffers(buffer, paths)
    }.bind(this)
    this._loadAudio(path, onLoad)
  }

  SoundHandler.prototype.startAlarm = function () {
    if (this.alarmReady && !this.audioSource) {
      this._playBuffer(this.alarmBuffer, true)
    } else {
      window.setTimeout(this.startAlarm.bind(this), 1000)
    }
  }

  SoundHandler.prototype.stopAlarm = function () {
    this.audioSource.stop()
    this.audioSource = null
  }
  // PRIVATE

  SoundHandler.prototype._playBuffers = function (buffer, paths) {
    var onEnd = function () {
      this.play(paths)
    }.bind(this)
    this._playBuffer(buffer, false, onEnd)
  }

  SoundHandler.prototype._playBuffer = function (buffer, loop, onEnd) {
    this.audioSource = this.audioContext.createBufferSource()
    this.audioSource.buffer = buffer
    var gainNode = this.audioContext.createGain()
    this.audioSource.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    gainNode.gain.volume = 20.0
    this.audioSource.loop = loop
    this.audioSource.onended = onEnd
    this.audioSource.start(0)
  }

  SoundHandler.prototype._loadAlarmAudio = function () {
    var onSuccess = function (buffer) {
      this.alarmBuffer = buffer
      this.alarmReady = true
    }.bind(this)
    this._loadAudio("/media/alarm.wav", onSuccess)
  }

  SoundHandler.prototype._loadAudio = function (path, onSuccess) {
    if (!this.audioContext) { return }

    var request = new XMLHttpRequest();
    request.open("GET", path, true);
    request.responseType = "arraybuffer";

    var onError = function (error) {
      console.log(error);
    };

    request.onload = function () {
      this.audioContext.decodeAudioData(request.response, onSuccess, onError);
    }.bind(this);

    request.send();
  };

  SoundHandler.prototype._getAudioContext = function () {
    try {
      this.audioContext = window.AudioContext ? new AudioContext() : new webkitAudioContext()
    } catch (e) {
      alert("Web Audio Not Supported in this Browser");
    }
  };

  window.SoundHandler = SoundHandler
})()
