(function () {
    'use strict';

    angular
        .module('amg')
        .controller('VideoController', VideoController);

    VideoController.$inject = ['$location', '$scope'];
    function VideoController($location, $scope) {
        let vm = this;

        let videoSrc = $location.search().src;
        let lastVolume = 1;
        let seeking = false;
        let hls = null;

        // Video player elements
        let video = document.getElementById('video');
        let playButton = document.getElementById('play-pause');
        let bigPlayButton = document.getElementById('big-play-pause');
        let muteButton = document.getElementById('mute');
        let fullScreenButton = document.getElementById('full-screen');
        let seekBar = document.getElementById('seek-bar');
        let volumeBar = document.getElementById('volume-bar');

        // Video player events
        video.addEventListener('timeupdate', onVideoTimeUpdate);
        video.addEventListener('volumechange', onVolumeChange);
        video.addEventListener('pause', onVideoPause);
        video.addEventListener('playing', onVideoPlay);

        // Video control events
        playButton.addEventListener('click', onPlayClick);
        bigPlayButton.addEventListener('click', onPlayClick);
        muteButton.addEventListener('click', onMuteClick);
        fullScreenButton.addEventListener('click', onFullScreenClick);
        seekBar.addEventListener('change', onSeekBarChange);
        seekBar.addEventListener('mousedown', onSeekMouseDown);
        seekBar.addEventListener('mouseup', onSeekMouseUp);
        volumeBar.addEventListener('change', onVolumeBarChange);

        // View vars
        vm.video = video;
        vm.playing = false;
        vm.setSource = setSource;

        attachHls();

        ////////////////

        function attachHls() {
            if (!Hls.isSupported() || !videoSrc) {
                return;
            }

            hls = new Hls();

            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed);

            function onManifestParsed() {
                video.play();

                vm.sources = hls.levels;
                vm.currentSource = hls.currentLevel;

                $scope.$digest();
            }
        }

        function setSource(source) {
            hls.currentLevel = source;
            vm.currentSource = source;
            vm.selectingSource = false;
        }

        function onVideoPause() {
            if (seeking) {
                return;
            }

            vm.playing = false;

            $scope.$digest();
        }

        function onVideoPlay() {
            vm.playing = true;

            $scope.$digest();
        }

        function onVolumeChange() {
            volumeBar.value = video.volume;

            $scope.$digest();
        }

        function onPlayClick() {
            video.paused ? video.play() : video.pause();
        }

        function onMuteClick() {
            video.muted = !video.muted;

            if (video.muted) {
                lastVolume = video.volume;
                video.volume = 0;
            } else {
                video.volume = lastVolume;
            }
        }

        function onFullScreenClick() {
            let fullSreenElement = null;

            if (document.fullscreenElement) {
                fullSreenElement = document.fullscreenElement;
            } else if (document.mozFullscreenElement) {
                fullSreenElement = document.mozFullscreenElement;
            } else if (document.webkitFullscreenElement) {
                fullSreenElement = document.webkitFullscreenElement;
            }

            let isFullscreen = fullSreenElement !== null;

            if (isFullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozExitFullscreen) {
                    document.mozExitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            } else {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.mozRequestFullScreen) {
                    video.mozRequestFullScreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                }
            }
        }

        function onSeekBarChange() {
            let time = video.duration * (seekBar.value / 100);

            video.currentTime = time;
        }

        function onVideoTimeUpdate() {
            let value = (100 / video.duration) * video.currentTime;

            seekBar.value = value;

            $scope.$digest();
        }

        function onSeekMouseDown() {
            seeking = true;

            video.pause();
        }

        function onSeekMouseUp() {
            video.play();

            seeking = false;
        }

        function onVolumeBarChange() {
            video.muted = false;
            video.volume = volumeBar.value;
        }
    }
})();