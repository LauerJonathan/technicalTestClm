<template>
    <div class="counter-display">
      <div v-for="(digit, index) in digits" :key="index" class="digit-container">
        <div class="digit-box" :style="{ animationDelay: `${index * 150}ms` }">
          {{ digit }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'YearFlipCounter',
    props: {
      year: {
        type: [String, Number],
        default: '2025'
      }
    },
    computed: {
      digits() {
        return String(this.year).split('');
      }
    }
  }
  </script>
  
  <style scoped>
  .counter-display {
    display: flex;
    justify-content: center;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .digit-container {
    margin: 0 5px;
  }
  
  .digit-box {
    width: 60px;
    height: 80px;
    background-color: rgb(18, 18, 18);
    border: 2px solid rgb(239, 133, 77);
    border-radius: 8px;
    color: rgb(239, 133, 77);
    font-size: 40px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: flipIn 0.6s ease-out both;
  }
  
  @keyframes flipIn {
    0% {
      transform: rotateX(90deg);
      opacity: 0;
    }
    60% {
      transform: rotateX(-20deg);
    }
    100% {
      transform: rotateX(0deg);
      opacity: 1;
    }
  }
  </style>