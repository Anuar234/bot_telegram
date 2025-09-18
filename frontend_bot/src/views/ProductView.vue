<template>
    <div class="product-container">
        <div v-if="loading" class="loading">
            Загрузка...
        </div>

        <div v-else-if="product" class="product-content">
            <div class="product-header">
                <div class="product-image" v-if="product.image_url">
                    <img :src="product.image_url" :alt="product.name" />
                </div>
                <h1>{{ product.name }}</h1>
                <p v-if="product.description" class="description">
                    {{ product.description }}
                </p>
            </div>

            <div class="menu-options">
                <div class="menu-card" @click="openTraining">
                    <div class="menu-icon">🏋️</div>
                    <h3>Программа тренировок</h3>
                    <p>Видео упражнения и программы</p>
                    <div class="arrow">→</div>
                </div>

                <div class="menu-card" @click="showProductInfo">
                    <div class="menu-icon">ℹ️</div>
                    <h3>О тренажере</h3>
                    <p>Информация и характеристики</p>
                    <div class="arrow">→</div>
                </div>

                <div class="menu-card" @click="openSupport">
                    <div class="menu-icon">💬</div>
                    <h3>Написать консультанту</h3>
                    <p>Задать вопрос специалисту</p>
                    <div class="arrow">→</div>
                </div>
            </div>

            <!-- Модальное окно с информацией о продукте -->
            <div v-if="showInfo" class="modal-overlay" @click="closeModal">
                <div class="modal-content" @click.stop>
                    <div class="modal-header">
                        <h3>О тренажере</h3>
                        <button @click="closeModal" class="close-button">×</button>
                    </div>
                    <div class="modal-body">
                        <h4>{{ product.name }}</h4>
                        <p v-if="product.description">{{ product.description }}</p>
                        <div class="info-section">
                            <h5>Преимущества:</h5>
                            <ul>
                                <li>Эффективная тренировка всех групп мышц</li>
                                <li>Компактный дизайн для дома</li>
                                <li>Программы для разного уровня подготовки</li>
                                <li>Видео-инструкции от профессиональных тренеров</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="error">
            Продукт не найден
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductView',
    props: ['id'],
    data() {
        return {
            product: null,
            loading: true,
            showInfo: false
        }
    },
    async mounted() {
        await this.fetchProduct()
    },
    methods: {
        async fetchProduct() {
            try {
                const tg_user = window.Telegram.WebApp.initDataUnsafe?.user
                if (!tg_user) {
                    throw new Error('Telegram user data not available')
                }

                const response = await fetch(`YOUR_API_URL/api/product/${this.id}?tg_id=${tg_user.id}`)
                
                if (response.ok) {
                    this.product = await response.json()
                } else {
                    console.error('Product not found or no access')
                }
            } catch (error) {
                console.error('Error fetching product:', error)
            } finally {
                this.loading = false
            }
        },
        openTraining() {
            this.$router.push(`/training/${this.product.id}`)
        },
        showProductInfo() {
            this.showInfo = true
        },
        openSupport() {
            this.$router.push(`/support?product_id=${this.product.id}`)
        },
        closeModal() {
            this.showInfo = false
        }
    }
}
</script>

<style scoped>
.product-container {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.loading, .error {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #666;
}

.product-header {
    text-align: center;
    margin-bottom: 30px;
}

.product-image {
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
    border-radius: 12px;
    overflow: hidden;
    background: #f0f0f0;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-header h1 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 24px;
}

.description {
    color: #666;
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
}

.menu-options {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.menu-card {
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

.menu-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.menu-icon {
    font-size: 32px;
    min-width: 50px;
}

.menu-card div:nth-child(2) {
    flex: 1;
}

.menu-card h3 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 18px;
}

.menu-card p {
    margin: 0;
    color: #666;
    font-size: 14px;
}

.arrow {
    color: #007aff;
    font-size: 20px;
    font-weight: bold;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 90%;
    max-height: 80%;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0;
    border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
    margin: 0;
    color: #333;
}

.close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
}

.modal-body {
    padding: 20px;
}

.modal-body h4 {
    margin: 0 0 16px 0;
    color: #333;
}

.info-section {
    margin-top: 20px;
}

.info-section h5 {
    margin: 0 0 12px 0;
    color: #333;
}

.info-section ul {
    margin: 0;
    padding-left: 20px;
}

.info-section li {
    margin-bottom: 8px;
    color: #666;
}
</style>