/**
 * eventBus.js
 *
 * Global event bus menggunakan `mitt`.
 * Menggantikan implementasi sebelumnya yang menggunakan createApp({}) kedua.
 *
 * API yang tersedia:
 *   eventBus.emit('event-name', payload)
 *   eventBus.on('event-name', handler)
 *   eventBus.off('event-name', handler)
 *
 * Cara import di komponen:
 *   import eventBus from '@/util/eventBus';
 */

import mitt from 'mitt';

const eventBus = mitt();

export default eventBus;
