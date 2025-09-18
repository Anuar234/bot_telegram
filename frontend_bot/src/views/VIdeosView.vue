    <template>
    <div class="videos-container">
        <div class="header">
            <h2>Видео тренировок</h2>
        </div>

        <div v-if="loading" class="loading">
            Загружаем видео...
        </div>

        <div v-else-if="videos.length > 0" class="videos-list">
            <div 
                v-for="video in videos" 
                :key="video.id" 
                class="video-card"
                @click="openVideo(video.youtube_url)"
            >
                <div class="video-thumbnail">
                    <img :src="getYoutubeThumbnail(video.youtube_url)" :alt="video.title" />
                    <div class="play-button">▶</div>
                    <div v-if="video.duration_seconds" class="duration">
                        {{ formatDuration(video.duration_seconds) }}
                    </div>
                </div>
                <div class="video-info">
                    <h3>{{ video.title }}</h3>
                    <p v-if="video.description">{{ video.description }}</p>
                </div>
            </div>
        </div>

        <div v-else class="no-videos">
            <h3>Видео не найдены</h3>
            <p>Для этой программы пока нет доступных видео</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VideosView',
    props: ['programId'],
    data() {
        return {
            videos: [],
            loading: true
        }
    },
    async mounted() {
        await this.fetchVideos()
    },
    methods: {
        async fetchVideos() {
            try {
                const tg_user = window.Telegram.WebApp.initDataUnsafe?.user
                if (!tg_user) {
                    throw new Error('Telegram user data not available')
                }

                const response = await fetch(`YOUR_API_URL/api/training-videos/${this.programId}?tg_id=${tg_user.id}`)
                
                if (response.ok) {
                    const data = await response.json()
                    this.videos = data.videos
                } else {
                    console.error('Failed to fetch videos')
                }
            } catch (error) {
                console.error('Error fetching videos:', error)
            } finally {
                this.loading = false
            }
        },
        openVideo(youtubeUrl) {
            // Открываем видео в YouTube или в встроенном плеере Telegram
            if (window.Telegram.WebApp) {
                window.Telegram.WebApp.openLink(youtubeUrl)
            } else {
                window.open(youtubeUrl, '_blank')
            }
        },
        getYoutubeThumbnail(url) {
            // Извлекаем ID видео из URL YouTube
            const videoId = this.extractYouTubeId(url)
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        },
        extractYouTubeId(url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
            const match = url.match(regExp)
            return (match && match[2].length === 11) ? match[2] : null
        },
        formatDuration(seconds) {
            if (!seconds) return ''
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = seconds % 60
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
        }
    }
}
</script>

<style scoped>
.videos-container {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.header {
    text-align: center;
    margin-bottom: 30px;
}

.header h2 {
    color: #333;
    margin: 0;
}

.loading {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #666;
}

.videos-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.video-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.video-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.video-thumbnail {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: #000;
}

.video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.3s ease;
}

.video-card:hover .play-button {
    background: rgba(0, 122, 255, 0.9);
    transform: translate(-50%, -50%) scale(1.1);
}

.duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.video-info {
    padding: 16px;
}

.video-info h3 {
    margin: 0 0 12px 0;
    color: #333;
    font-size: 16px;
    line-height: 1.3;
}

.video-info p {
    margin: 0;
    color: #666;
    font-size: 14px;
    line-height: 1.4;
}

.no-videos {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    padding: 40px 20px;
}

.no-videos h3 {
    margin: 0 0 16px 0;
    color: #333;
}

.no-videos p {
    margin: 0;
    color: #666;
    line-height: 1.5;
}
</style>