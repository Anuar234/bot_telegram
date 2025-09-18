<template>
    <div class="support-container">
        <div class="header">
            <h2>Поддержка</h2>
            <p>Задайте вопрос нашему консультанту</p>
        </div>

        <div class="message-form">
            <textarea
                v-model="message"
                placeholder="Опишите ваш вопрос или проблему..."
                class="message-input"
                rows="5"
            ></textarea>
            <button 
                @click="sendMessage" 
                class="send-button"
                :disabled="loading || !message.trim()"
            >
                {{ loading ? 'Отправляем...' : 'Отправить' }}
            </button>
        </div>

        <div v-if="success" class="success-message">
            ✓ Ваше сообщение отправлено! Консультант свяжется с вами в ближайшее время.
        </div>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>

        <div class="previous-requests" v-if="requests.length > 0">
            <h3>Предыдущие обращения</h3>
            <div 
                v-for="request in requests" 
                :key="request.id" 
                class="request-card"
            >
                <div class="request-header">
                    <span class="request-date">
                        {{ formatDate(request.created_at) }}
                    </span>
                    <span class="request-status" :class="request.status">
                        {{ getStatusText(request.status) }}
                    </span>
                </div>
                <div class="request-message">
                    {{ request.message }}
                </div>
            </div>
        </div>

        <div class="contact-info">
            <h3>Другие способы связи</h3>
            <div class="contact-methods">
                <div class="contact-method">
                    <span class="contact-icon">📞</span>
                    <span>Телефон: +7 (XXX) XXX-XX-XX</span>
                </div>
                <div class="contact-method">
                    <span class="contact-icon">📧</span>
                    <span>Email: support@trainer.com</span>
                </div>
                <div class="contact-method">
                    <span class="contact-icon">⏰</span>
                    <span>Режим работы: Пн-Пт 9:00-18:00</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SupportView',
    data() {
        return {
            message: '',
            loading: false,
            success: false,
            error: '',
            requests: []
        }
    },
    async mounted() {
        await this.fetchPreviousRequests()
    },
    methods: {
        async sendMessage() {
            if (!this.message.trim()) {
                this.error = 'Введите сообщение'
                return
            }

            this.loading = true
            this.error = ''
            this.success = false

            try {
                const tg_user = window.Telegram.WebApp.initDataUnsafe?.user
                if (!tg_user) {
                    throw new Error('Telegram user data not available')
                }

                // Получаем product_id из URL параметров если есть
                const urlParams = new URLSearchParams(window.location.search)
                const productId = urlParams.get('product_id')

                const response = await fetch('https://effective-computing-machine-7j6qr67xwr6cp99r-8000.app.github.dev//api/support', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tg_id: tg_user.id,
                        message: this.message.trim(),
                        product_id: productId ? parseInt(productId) : null
                    })
                })

                const data = await response.json()

                if (response.ok) {
                    this.success = true
                    this.message = ''
                    await this.fetchPreviousRequests()
                    
                    // Автоматически скрываем сообщение об успехе через 3 секунды
                    setTimeout(() => {
                        this.success = false
                    }, 3000)
                } else {
                    this.error = data.detail || 'Ошибка при отправке сообщения'
                }
            } catch (error) {
                console.error('Error sending message:', error)
                this.error = 'Ошибка при отправке сообщения'
            } finally {
                this.loading = false
            }
        },
        async fetchPreviousRequests() {
            try {
                const tg_user = window.Telegram.WebApp.initDataUnsafe?.user
                if (!tg_user) return

                const response = await fetch(`https://effective-computing-machine-7j6qr67xwr6cp99r-8000.app.github.dev//api/support/${tg_user.id}`)
                
                if (response.ok) {
                    const data = await response.json()
                    this.requests = data.requests
                }
            } catch (error) {
                console.error('Error fetching requests:', error)
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString)
            return date.toLocaleString('ru-RU', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        getStatusText(status) {
            const statusMap = {
                'new': 'Новое',
                'in_progress': 'В работе',
                'resolved': 'Решено'
            }
            return statusMap[status] || status
        }
    }
}
</script>

<style scoped>
.support-container {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.header {
    text-align: center;
}

.header h2 {
    color: #333;
    margin: 0 0 8px 0;
}

.header p {
    color: #666;
    margin: 0;
}

.message-form {
    background: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.message-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    font-family: inherit;
    resize: vertical;
    min-height: 100px;
    box-sizing: border-box;
}

.message-input:focus {
    outline: none;
    border-color: #007aff;
}

.send-button {
    width: 100%;
    background: #007aff;
    color: white;
    border: none;
    padding: 12px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 16px;
}

.send-button:hover:not(:disabled) {
    background: #0056d3;
}

.send-button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.success-message {
    background: #e8f5e8;
    color: #2e7d32;
    padding: 16px;
    border-radius: 8px;
    border-left: 4px solid #4caf50;
    text-align: center;
}

.error-message {
    background: #ffebee;
    color: #c62828;
    padding: 16px;
    border-radius: 8px;
    border-left: 4px solid #c62828;
}

.previous-requests h3 {
    color: #333;
    margin: 0 0 16px 0;
}

.request-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.request-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.request-date {
    font-size: 14px;
    color: #666;
}

.request-status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.request-status.new {
    background: #e3f2fd;
    color: #1976d2;
}

.request-status.in_progress {
    background: #fff3e0;
    color: #f57c00;
}

.request-status.resolved {
    background: #e8f5e8;
    color: #2e7d32;
}

.request-message {
    color: #333;
    line-height: 1.4;
}

.contact-info {
    background: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.contact-info h3 {
    color: #333;
    margin: 0 0 16px 0;
}

.contact-methods {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.contact-method {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #666;
}

.contact-icon {
    font-size: 18px;
}
</style>