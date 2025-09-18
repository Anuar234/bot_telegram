<template>
    <nav class="navbar">
        <router-link to="/" class="nav-link">Главная</router-link>
        <router-link to="/scan-qr" class="nav-link">QR Код</router-link>
        <router-link to="/support" class="nav-link">Поддержка</router-link>
    </nav>
</template>

<script>
export default {
    name: "Navbar"
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #007aff;
  color: white;
}
</style>