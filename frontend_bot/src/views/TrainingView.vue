<template>
    <div class="training-container">
        <div class="header">
            <h2>Программы тренировок</h2>
        </div>

        <div v-if="loading" class="loading">
            Загружаем программы...
        </div>

        <div v-else-if="programs.length > 0" class="programs-list">
            <div 
                v-for="program in programs" 
                :key="program.id" 
                class="program-card"
                @click="openProgram(program.id)"
            >
                <div class="program-info">
                    <h3>{{ program.title }}</h3>
                    <p v-if="program.description">{{ program.description }}</p>
                    <div class="videos-count">
                        📹 {{ program.videos.length }} {{ getVideosWord(program.videos.length) }}
                    </div>
                </div>
                <div class="arrow">→</div>
            </div>
        </div>

        <div v-else class="no-programs">
            <h3>Программы не найдены</h3>
            <p>Для этого тренажера пока нет доступных программ тренировок</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TrainingView',
    props: ['productId'],
    data() {
        return {
            programs: [],
            loading: true
        }
    },
    async mounted() {
        await this.fetchPrograms()
    },
    methods: {
        async fetchPrograms() {
            try {
                const tg_user = window.Telegram.WebApp.initDataUnsafe?.user
                if (!tg_user) {
                    throw new Error('Telegram user data not available')
                }

                const response = await fetch(`YOUR_API_URL/api/training-programs/${this.productId}?tg_id=${tg_user.id}`)
                
                if (response.ok) {
                    const data = await response.json()
                    this.programs = data.programs
                } else {
                    console.error('Failed to fetch programs')
                }
            } catch (error) {
                console.error('Error fetching programs:', error)
            } finally {
                this.loading = false
            }
        },
        openProgram(programId) {
            this.$router.push(`/videos/${programId}`)
        },
        getVideosWord(count) {
            if (count === 1) return 'видео'
            if (count > 1 && count < 5) return 'видео'
            return 'видео'
        }
    }
}
</script>

<style scoped>
.training-container {
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

.programs-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.program-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    display: flex;
    align-items: center;
    gap: 16px;
}

.program-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.program-info {
    flex: 1;
}

.program-info h3 {
    margin: 0 0 12px 0;
    color: #333;
    font-size: 18px;
}
</style>