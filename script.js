let audioContext;
let sourceElement = new Audio();
let sourceNode;
let playlist = [];
let currentIndex = 0;

function handleFileSelect(e) {
    playlist = Array.from(e.target.files);
    if (playlist.length > 0) {
        currentIndex = 0;
        playSong(currentIndex);
    } else {
        updatePlaylistUI();
    }
}

function playSong(index) {
    const file = playlist[index];
    if (file) {
        const url = URL.createObjectURL(file);
        sourceElement.src = url;
        sourceElement.load();
        sourceElement.play();
        document.getElementById('playPauseBtn').textContent = '⏸';
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            sourceNode = audioContext.createMediaElementSource(sourceElement);
            sourceNode.connect(audioContext.destination);
        }
        updatePlaylistUI();
        document.getElementById('nowPlaying').textContent = file.name;
    }
}

function updatePlaylistUI() {
    const trackList = document.getElementById('trackList');
    trackList.innerHTML = '';
    if (playlist.length === 0) {
        trackList.innerHTML = '<div class="panel-message">No tracks uploaded yet</div>';
        return;
    }
    playlist.forEach((file, idx) => {
        const div = document.createElement('div');
        div.className = 'playlist-item' + (idx === currentIndex ? ' active' : '');
        div.textContent = file.name;
        div.addEventListener('click', () => {
            currentIndex = idx;
            playSong(currentIndex);
            updatePlaylistUI();
        });
        trackList.appendChild(div);
    });
}

function play() {
    sourceElement.play();
    document.getElementById('playPauseBtn').textContent = '⏸';
}

function pause() {
    sourceElement.pause();
    document.getElementById('playPauseBtn').textContent = '▶';
}

function skip(seconds) {
    if (sourceElement.currentTime !== undefined) {
        sourceElement.currentTime = Math.min(sourceElement.duration, sourceElement.currentTime + seconds);
    }
}

function rewind(seconds) {
    if (sourceElement.currentTime !== undefined) {
        sourceElement.currentTime = Math.max(0, sourceElement.currentTime - seconds);
    }
}

// Volume control
document.getElementById('volumeSlider').addEventListener('input', function(e) {
    sourceElement.volume = parseFloat(e.target.value);
});

document.getElementById('playPauseBtn').addEventListener('click', function() {
    if (sourceElement.paused) {
        play();
    } else {
        pause();
    }
});

document.getElementById('rewindBtn').addEventListener('click', function() {
    rewind(10); // rewinds 10 seconds
});

document.getElementById('skipBtn').addEventListener('click', function() {
    skip(10); // skips forward 10 seconds
});

document.getElementById('fileInput').addEventListener('change', handleFileSelect);

document.getElementById('nextBtn').addEventListener('click', function() {
    if (playlist.length > 0) {
        currentIndex = (currentIndex + 1) % playlist.length;
        playSong(currentIndex);
    }
});

document.getElementById('prevBtn').addEventListener('click', function() {
    if (playlist.length > 0) {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        playSong(currentIndex);
    }
});

const dropArea = document.getElementById('dropArea');
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
});
dropArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
});
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    document.getElementById('fileInput').files = e.dataTransfer.files;
    document.getElementById('fileInput').dispatchEvent(new Event('change'));
});
dropArea.addEventListener('click', () => {
    document.getElementById('fileInput').click();
});