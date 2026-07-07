import { reactive, computed } from 'vue'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

export const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

const ALL_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00']

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const TODAY = startOfToday()

// Module-level state acts as a lightweight shared store between
// the calendar and the booking form, without needing Pinia for one screen.
const state = reactive({
  currentDate: startOfMonth(TODAY),
  selectedDay: null,
  selectedSlot: null,
  selectedService: null,
  confirmedDetails: null,
  // Slots already booked for the displayed month, fetched from Supabase: { [day]: string[] }
  takenByDay: {},
  loadingSlots: false,
  submitting: false,
  submitError: null,
})

let hasLoadedInitialMonth = false

async function loadTakenSlots() {
  if (!isSupabaseConfigured) return

  state.loadingSlots = true
  const month = state.currentDate.getMonth() + 1
  const year = state.currentDate.getFullYear()

  const { data, error } = await supabase
    .from('bookings')
    .select('booking_day, slot')
    .eq('booking_month', month)
    .eq('booking_year', year)
    .neq('status', 'annule')

  state.loadingSlots = false

  if (error) {
    console.error('[bookings] impossible de charger les créneaux pris', error)
    return
  }

  const map = {}
  for (const row of data) {
    ;(map[row.booking_day] ??= []).push(row.slot)
  }
  state.takenByDay = map
}

const monthLabel = computed(() => `${MONTHS_FR[state.currentDate.getMonth()]} ${state.currentDate.getFullYear()}`)

const calendarCells = computed(() => {
  const y = state.currentDate.getFullYear()
  const m = state.currentDate.getMonth()
  const firstDay = new Date(y, m, 1)
  let startDow = firstDay.getDay()
  if (startDow === 0) startDow = 7
  const daysInMonth = new Date(y, m + 1, 0).getDate()

  const cells = []
  for (let i = 1; i < startDow; i++) {
    cells.push({ empty: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(y, m, d)
    const isPast = dayDate < TODAY
    const isSameMonth = m === TODAY.getMonth() && y === TODAY.getFullYear()
    const isWeekday = dayDate.getDay() >= 1 && dayDate.getDay() <= 5
    cells.push({
      day: d,
      empty: false,
      past: isPast,
      today: isSameMonth && d === TODAY.getDate(),
      available: isWeekday && !isPast,
      selected: state.selectedDay === d,
    })
  }
  return cells
})

const slots = computed(() => {
  if (!state.selectedDay) return []
  const taken = state.takenByDay[state.selectedDay] || []
  return ALL_SLOTS.map((time) => ({
    time,
    taken: taken.includes(time),
    selected: state.selectedSlot === time,
  }))
})

const summaryText = computed(() => {
  if (!state.selectedDay) return null
  const m = MONTHS_FR[state.currentDate.getMonth()]
  let text = `${state.selectedDay} ${m} ${state.currentDate.getFullYear()}`
  if (state.selectedSlot) text += ` à ${state.selectedSlot}`
  return text
})

function changeMonth(dir) {
  state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + dir, 1)
  state.selectedDay = null
  state.selectedSlot = null
  loadTakenSlots()
}

function selectDay(day) {
  state.selectedDay = day
  state.selectedSlot = null
}

function selectSlot(time) {
  state.selectedSlot = time
}

function selectService(name) {
  state.selectedService = name
}

async function submitBooking({ name, phone, email, description }) {
  state.submitting = true
  state.submitError = null

  const payload = {
    booking_day: state.selectedDay,
    booking_month: state.currentDate.getMonth() + 1,
    booking_year: state.currentDate.getFullYear(),
    slot: state.selectedSlot,
    service: state.selectedService,
    name,
    phone,
    email,
    description: description || null,
  }

  const { error } = await supabase.from('bookings').insert(payload)
  state.submitting = false

  if (error) {
    console.error('[bookings] échec de la réservation', error)
    state.submitError = "La réservation n'a pas pu être enregistrée. Réessayez dans un instant."
    return false
  }

  const monthName = MONTHS_FR[state.currentDate.getMonth()]
  state.confirmedDetails = {
    name,
    email,
    service: state.selectedService,
    dateText: `${state.selectedDay} ${monthName} ${state.currentDate.getFullYear()} à ${state.selectedSlot}`,
  }

  loadTakenSlots()
  return true
}

function resetBooking() {
  state.selectedDay = null
  state.selectedSlot = null
  state.selectedService = null
  state.confirmedDetails = null
  state.submitError = null
}

export function useBooking() {
  if (!hasLoadedInitialMonth) {
    hasLoadedInitialMonth = true
    loadTakenSlots()
  }

  return {
    state,
    monthLabel,
    calendarCells,
    slots,
    summaryText,
    changeMonth,
    selectDay,
    selectSlot,
    selectService,
    submitBooking,
    resetBooking,
  }
}
