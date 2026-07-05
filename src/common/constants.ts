export const SITE_TITLE = 'Ceritakan'
export const SITE_URL = 'https://ceritakan.vyonizr.com/'
export const SITE_DESCRIPTION =
  'Ceritakan adalah sebuah permainan kartu yang berisi pertanyaan-pertanyaan dengan topik yang beragam.'
export const OG_IMAGE_URL = '/images/ceritakan_og.jpg'

export const TOUR_STEPS = [
  {
    target: '.tour-open-card',
    content: 'Ketuk kartu untuk membuka pertanyaan',
    skipBeacon: true,
    buttons: [],
  },
  {
    target: '.tour-open-card',
    content: 'Ketuk kartunya lagi untuk mendapatkan pertanyaan baru',
    skipBeacon: true,
    buttons: [],
  },
]

export const CARD_FLIP_DURATION = 0.5
export const CARD_FLIP_DEGREE = 180
export const CARD_MAX_ROTATE_DEGREE = 1
export const CARD_MIN_ROTATE_DEGREE = 0 - CARD_MAX_ROTATE_DEGREE
export const ERROR_MESSAGE = 'Ada yang salah nih. Coba di-refresh, ya.'

export const LIGHT = 'light'
export const DARK = 'dark'

// The original topic names/icons lived only in the now-decommissioned
// Postgres DB and weren't backed up. This mapping is a best-effort
// reconstruction based on each topic_id's question content in the CSV.
export const TOPICS: Record<number, { name: string; icon: string }> = {
  1: { name: 'Umum', icon: '🌐' },
  2: { name: 'Cinta', icon: '❤️' },
  3: { name: 'Musik', icon: '🎵' },
  4: { name: 'Pekerjaan', icon: '💼' },
  5: { name: 'Film', icon: '🎬' },
}
