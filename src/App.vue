<script setup lang="ts">
import { computed, ref } from 'vue'
import data from './data/data.json'

type Severity = 'Low' | 'Medium' | 'High' | 'Critical'

const reportOpen = ref(false)
const savedNotice = ref(false)
const selectedType = ref('Hazard')
const selectedSeverity = ref<Severity>('Medium')
const note = ref('')
const checklist = ref(data.safetyChecklist.map((item) => ({ ...item })))

const checkedInCount = computed(() => data.crew.filter((person) => person.checkedIn).length)
const checklistCount = computed(() => checklist.value.filter((item) => item.completed).length)
const incidentsBySeverity = computed(() => [
  { label: 'Low', count: data.incidents.filter((item) => item.severity === 'Low').length, color: 'low' },
  { label: 'Medium', count: data.incidents.filter((item) => item.severity === 'Medium').length, color: 'medium' },
  { label: 'High', count: data.incidents.filter((item) => item.severity === 'High').length, color: 'high' },
  { label: 'Critical', count: data.incidents.filter((item) => item.severity === 'Critical').length, color: 'critical' },
])

const openReport = () => {
  reportOpen.value = true
  savedNotice.value = false
}

const saveReport = () => {
  savedNotice.value = true
  reportOpen.value = false
}

const toggleChecklist = (index: number) => {
  checklist.value[index].completed = !checklist.value[index].completed
}

const formatTime = (timestamp: string) => new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
</script>

<template>
  <v-app>
    <v-main>
      <div class="app-shell">
        <header class="topbar">
          <div class="brand-lockup"><div class="brand-mark"><v-icon icon="mdi-hard-hat" size="24" /></div><div><p class="eyebrow">Riverside build site</p><h1>Site safety</h1></div></div>
          <div class="connection-pill"><span class="connection-dot" /> Connected</div>
        </header>

        <main class="content">
          <section class="welcome-row"><div><p class="eyebrow">Tuesday, September 8</p><h2>Good morning, Jordan</h2><p class="muted">Here is the site picture for your shift.</p></div><div class="weather"><v-icon icon="mdi-weather-partly-cloudy" size="26" /><strong>68°</strong><span>Clear</span></div></section>
          <button class="report-cta" type="button" @click="openReport"><span class="cta-icon"><v-icon icon="mdi-camera-plus-outline" size="29" /></span><span class="cta-copy"><strong>Report incident</strong><small>Photo, note, and severity in under a minute</small></span><v-icon icon="mdi-arrow-right" size="25" /></button>
          <div v-if="savedNotice" class="saved-banner"><v-icon icon="mdi-check-circle" size="22" /><span><strong>Incident saved locally.</strong> It will send when connected.</span><button type="button" aria-label="Dismiss" @click="savedNotice = false"><v-icon icon="mdi-close" /></button></div>

          <section class="stat-grid" aria-label="Daily overview"><article class="stat-card"><span class="stat-icon teal"><v-icon icon="mdi-account-check-outline" /></span><strong>{{ checkedInCount }}/{{ data.crew.length }}</strong><span>Crew checked in</span><small>One still expected</small></article><article class="stat-card"><span class="stat-icon amber"><v-icon icon="mdi-clipboard-check-outline" /></span><strong>{{ checklistCount }}/{{ checklist.length }}</strong><span>Safety checks</span><small>Keep the momentum</small></article><article class="stat-card"><span class="stat-icon coral"><v-icon icon="mdi-alert-outline" /></span><strong>{{ data.incidents.length }}</strong><span>Incidents today</span><small>Review before lunch</small></article></section>

          <div class="section-heading"><div><p class="eyebrow">Shift readiness</p><h3>Safety checklist</h3></div><span class="progress-label">{{ checklistCount }}/{{ checklist.length }}</span></div>
          <section class="checklist-list"><button v-for="(item, index) in checklist" :key="item.item" class="check-row" :class="{ complete: item.completed }" type="button" @click="toggleChecklist(index)"><span class="check-box"><v-icon v-if="item.completed" icon="mdi-check" size="18" /></span><span>{{ item.item }}</span><v-icon :icon="item.completed ? 'mdi-check-circle-outline' : 'mdi-circle-outline'" class="check-status" /></button></section>

          <div class="section-heading incidents-heading"><div><p class="eyebrow">Latest activity</p><h3>Today's incidents</h3></div><button type="button" class="text-button">View all <v-icon icon="mdi-arrow-right" size="17" /></button></div>
          <section class="incident-list"><article v-for="incident in data.incidents" :key="incident.id" class="incident-row"><div class="severity-bar" :class="incident.severity.toLowerCase()" /><div class="incident-content"><div class="incident-meta"><span class="severity-tag" :class="incident.severity.toLowerCase()">{{ incident.severity }}</span><span>{{ formatTime(incident.timestamp) }}</span></div><strong>{{ incident.type }}</strong><p>{{ incident.note }}</p><small><v-icon icon="mdi-account-outline" size="14" /> {{ incident.reportedBy }} <span class="sync-label"><v-icon icon="mdi-cloud-check-outline" size="14" /> Synced</span></small></div><v-icon icon="mdi-chevron-right" class="row-chevron" /></article></section>

          <section class="insight-panel"><div><p class="eyebrow">Pattern watch</p><h3>Incidents by severity</h3><p class="muted">Two observations logged this shift.</p></div><div class="bar-chart"><div v-for="bar in incidentsBySeverity" :key="bar.label" class="bar-item"><span class="bar-value">{{ bar.count }}</span><div class="bar-track"><div class="bar-fill" :class="bar.color" :style="{ height: `${Math.max(bar.count * 34, 5)}px` }" /></div><small>{{ bar.label }}</small></div></div></section>
        </main>

        <nav class="bottom-nav" aria-label="Primary navigation"><button class="active" type="button"><v-icon icon="mdi-view-dashboard-outline" /><span>Today</span></button><button type="button" @click="openReport"><v-icon icon="mdi-plus-circle-outline" /><span>Report</span></button><button type="button"><v-icon icon="mdi-account-group-outline" /><span>Crew</span></button><button type="button"><v-icon icon="mdi-menu" /><span>More</span></button></nav>

        <v-dialog v-model="reportOpen" fullscreen transition="dialog-bottom-transition" scrim="rgba(16, 35, 38, .64)"><div class="report-sheet"><div class="sheet-header"><button type="button" aria-label="Close report" class="icon-button" @click="reportOpen = false"><v-icon icon="mdi-close" /></button><div><p class="eyebrow">Quick capture</p><h2>Report an incident</h2></div><span class="step-count">1 of 1</span></div><div class="capture-area"><v-icon icon="mdi-camera-outline" size="44" /><strong>Add a site photo</strong><span>Make the issue easy to find later.</span><button type="button" class="photo-button"><v-icon icon="mdi-camera" /> Take photo</button></div><div class="sheet-fields"><label class="field-label">What happened?</label><div class="choice-grid type-grid"><button v-for="type in ['Hazard', 'Near Miss', 'Injury', 'Property Damage', 'Equipment Failure']" :key="type" type="button" :class="{ selected: selectedType === type }" @click="selectedType = type">{{ type }}</button></div><label class="field-label">How serious is it?</label><div class="choice-grid severity-grid"><button v-for="severity in ['Low', 'Medium', 'High', 'Critical'] as Severity[]" :key="severity" type="button" :class="[severity.toLowerCase(), { selected: selectedSeverity === severity }]" @click="selectedSeverity = severity">{{ severity }}</button></div><label class="field-label" for="note">Add a short note <span>Optional</span></label><textarea id="note" v-model="note" rows="3" placeholder="What should the next person know?" /></div><div class="sheet-footer"><div class="offline-note"><v-icon icon="mdi-cloud-off-outline" /><span>Saved locally first<br /><small>Will sync when connected</small></span></div><button type="button" class="save-button" @click="saveReport">Save incident <v-icon icon="mdi-arrow-right" /></button></div></div></v-dialog>
      </div>
    </v-main>
  </v-app>
</template>
