<template>
  <div class="calendar-container glass" v-reveal="{ y: 40 }">
    <div class="cal-header">
      <div class="cal-month">{{ monthLabel }}</div>
      <div class="cal-nav">
        <button @click="changeMonth(-1)">‹</button>
        <button @click="changeMonth(1)">›</button>
      </div>
    </div>
    <div class="cal-days-header">
      <div class="cal-day-name" v-for="d in dayNames" :key="d">{{ d }}</div>
    </div>
    <div class="cal-grid">
      <div
        v-for="(cell, index) in calendarCells"
        :key="index"
        class="cal-cell"
        :class="{ empty: cell.empty, past: cell.past, today: cell.today, available: cell.available, selected: cell.selected }"
        @click="cell.available && selectDay(cell.day)"
      >
        {{ cell.empty ? '' : cell.day }}
      </div>
    </div>

    <div class="time-slots" v-if="state.selectedDay">
      <h4>{{ t('rdv.calendar.slotsFor', { day: state.selectedDay, month: monthLabel.split(' ')[0] }) }}</h4>
      <TransitionGroup name="slot-pop" tag="div" class="slots-grid">
        <div
          v-for="slot in slots"
          :key="state.selectedDay + '-' + slot.time"
          class="slot"
          :class="{ taken: slot.taken, selected: slot.selected }"
          @click="!slot.taken && selectSlot(slot.time)"
        >
          {{ slot.time }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBooking } from '../../composables/useBooking.js'

const { t, tm } = useI18n()
const { state, monthLabel, calendarCells, slots, changeMonth, selectDay, selectSlot } = useBooking()

const dayNames = computed(() => tm('rdv.calendar.dayNames'))
</script>

<style scoped>
.calendar-container {
  border-radius: var(--radius);
  padding: 32px;
}

.cal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.cal-month {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 18px;
}

.cal-nav {
  display: flex;
  gap: 8px;
}

.cal-nav button {
  width: 36px; height: 36px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  color: var(--text);
}

.cal-nav button:hover { background: var(--ink); color: white; border-color: var(--ink); }

.cal-days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.cal-day-name {
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  color: var(--text2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.cal-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  border: 1.5px solid transparent;
}

.cal-cell:hover:not(.empty):not(.past) { background: var(--accent-soft); color: var(--accent); }
.cal-cell.past { color: var(--border); cursor: not-allowed; }
.cal-cell.empty { cursor: default; }
.cal-cell.today { font-weight: 700; color: var(--accent); }
.cal-cell.selected { background: var(--accent) !important; color: white !important; border-color: var(--accent2); animation: cellPop 0.35s ease; }
.cal-cell.available { background: var(--green-soft); }
.cal-cell.available.selected { background: var(--accent) !important; }

@keyframes cellPop {
  0% { transform: scale(0.7); }
  60% { transform: scale(1.12); }
  100% { transform: scale(1); }
}

.time-slots {
  margin-top: 28px;
}

.time-slots h4 {
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 16px;
  color: var(--text2);
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.slot {
  padding: 10px;
  text-align: center;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  background: var(--bg2);
}

.slot:hover { border-color: var(--accent); color: var(--accent); }
.slot.selected { background: var(--accent); color: white; border-color: var(--accent); }
.slot.taken { background: var(--bg); color: var(--border); cursor: not-allowed; text-decoration: line-through; }

.slot-pop-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.slot-pop-enter-from { opacity: 0; transform: scale(0.8) translateY(6px); }
.slot-pop-leave-active { transition: opacity 0.15s ease; position: absolute; }
.slot-pop-leave-to { opacity: 0; }
</style>
