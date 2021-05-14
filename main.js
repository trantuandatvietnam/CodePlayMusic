const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE = 'F8_PLAYER'
// Các biến quan trọng sẽ lưu vào đây
const heading = $('header h2');
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn.btn-toggle-play");
const player = $(".player")
const progress = $("#progress")
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random")
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist")
const app = {

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    songs: [
        {
            name: "Hẹn em kiếp sau",
            singer: "Hương Tú",
            path: "./music/yt1s.com - Hẹn em kiếp sau  Lã x Duy Phúc x TiB  Hương Tú Cover.mp3",
            image: "./img/anh1.jpg"
        },
        {
            name: "Lấy Chồng Sớm Làm Gì",
            singer: "Hương Tú",
            path: "./music/yt1s.com - Lấy Chồng Sớm Làm Gì  HuyR ft Tuấn Cry Piano ver  Hương Tú Cover.mp3",
            image: "./img/anh2.jpg"
        },
        {
            name: "Người Có Thương",
            singer: "Hương Tú",
            path: "./music/yt1s.com - NGƯỜI CÓ THƯƠNG   DATKAA  HƯƠNG TÚ COVER.mp3",
            image: "./img/anh4.jpg"
        },
        {
            name: "Muộn Rồi Mà Sao Còn",
            singer: "Hương Tú",
            path: "./music/yt1s.com - Hẹn em kiếp sau  Lã x Duy Phúc x TiB  Hương Tú Cover.mp3",
            image: "./img/anh3.jpg"
        },
        {
            name: "Muộn Rồi Mà Sao Còn",
            singer: "Hương Tú",
            path: "./music/yt1s.com - SƠN TÙNG MTP  MUỘN RỒI MÀ SAO CÒN  OFFICIAL MUSIC VIDEO.mp3",
            image: "./img/anh5.jpg"
        },
        {
            name: "Muộn Rồi Mà Sao Còn",
            singer: "Hương Tú",
            path: "./music/yt1s.com - Hẹn em kiếp sau  Lã x Duy Phúc x TiB  Hương Tú Cover.mp3",
            image: "./img/anh6.jpg"
        },
        {
            name: "Muộn Rồi Mà Sao Còn",
            singer: "Hương Tú",
            path: "./music/yt1s.com - Hẹn em kiếp sau  Lã x Duy Phúc x TiB  Hương Tú Cover.mp3",
            image: "./img/anh5.jpg"
        },
        {
            name: "Muộn Rồi Mà Sao Còn",
            singer: "Hương Tú",
            path: "./music/yt1s.com - Hẹn em kiếp sau  Lã x Duy Phúc x TiB  Hương Tú Cover.mp3",
            image: "./img/anh5.jpg"
        },
        {
            name: "Muộn Rồi Mà Sao Còn",
            singer: "Hương Tú",
            path: "./music/yt1s.com - Hẹn em kiếp sau  Lã x Duy Phúc x TiB  Hương Tú Cover.mp3",
            image: "./img/anh6.jpg"
        },

    ],
    setConfig: function(key, value) {
        this.config[key] = value; 
        localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join(" ");
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const _this = this;     //_this lúc này chính là app
        const cdWidth = cd.offsetWidth;

        //xử lí cd quay/dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {duration: 10000,
            interation: Infinity
        })
        cdThumbAnimate.pause();

       // xử lí phóng to thu nhỏ cdWidth
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0 
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //xử lí khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play()
            }

        }

        //khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true;     //nếu ở đây chỉ viết this không thôi thì nó sẽ hiểu là thằng playBtn vì hiện tại đang là một phương thức khác nằm ngoài this
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //khi bài hát bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = this.currentTime / this.duration * 100;
                progress.value = progressPercent;
            }
        }

        //xử lí khi tua bài hát
        progress.onchange = function(e) {
            const percent =  e.target.value   //cũng giống như viết progress.value
            const seek = percent*(audio.duration)/100;
            audio.currentTime = seek;
        }
        //khi next bài hát
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            }else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            }else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //xử lí random/ bật, tắt random

        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle("active", _this.isRandom);
        }

        //xử lí chuyển bài hát khi đã kết thúc bài hát;
        audio.onended = function() {
            if (_this.isRepeat) {
                playBtn.click()
            } else {
                nextBtn.click()     //Tự bấm vào nút next
            }
        }

        //xử lí lặp lại một bài hát 
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRandom', _this.isRandom)
            repeatBtn.classList.toggle("active", _this.isRepeat)
        }

        //lắng nghe click
        playList.onclick = function(e) {
            //xử lí khi click vào bài hát 
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }

                //xử lí khi click vào song option
                if (e.target.closest('.option')) {

                }
            }
        }

    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            if (this.currentIndex == 0) {
                $(".song.active").scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }else{
                $(".song.active").scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 300)
    },
    loadCurrentSong: function() {
        heading.textContent  = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRandom = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex  < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        //gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        //Lắng nghe và xử lí các sự kiện (DOM EVENTS)
        this.handleEvent();

        //Tải thông tin bài hát vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        //Render Playlist
        this.render();

        //hiển thị trạng thái ban đầu button repeat & random
            repeatBtn.classList.toggle("active", this.isRepeat)
            randomBtn.classList.toggle("active", this.isRandom);
    }
}

app.start();

