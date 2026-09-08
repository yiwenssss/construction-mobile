<script setup lang="ts">
import { computed, ref } from 'vue'
import data from './data/data.json'

type Severity = 'Low' | 'Medium' | 'High' | 'Critical'

const reportOpen = ref(false)
const savedNotice = ref(false)
const glareMode = ref(false)
const currentPage = ref<'today' | 'incidents' | 'crew' | 'more'>('today')
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

const navigateTo = (page: 'today' | 'incidents' | 'crew' | 'more') => {
  currentPage.value = page
}
</script>

<template>
  <v-app>
    <v-main>
      <div class="app-shell" :class="{ 'glare-mode': glareMode }">
        <header class="topbar">
          <div class="brand-lockup"><div class="brand-mark"><v-icon icon="mdi-hard-hat" size="24" /></div><div><p class="eyebrow">Riverside build site</p><h1>Site safety</h1></div></div>
          <div class="header-actions"><div class="connection-pill"><span class="connection-dot" /> Connected</div><button class="mode-switch" type="button" :aria-pressed="glareMode" @click="glareMode = !glareMode"><v-icon :icon="glareMode ? 'mdi-white-balance-sunny' : 'mdi-contrast-circle'" size="18" /><span>{{ glareMode ? 'Glare' : 'Normal' }}</span></button></div>
        </header>

        <main v-if="currentPage === 'today'" class="content">
          <section class="welcome-row"><div><p class="eyebrow">Tuesday, September 8</p><h2>Good morning, Jordan</h2><p class="muted">Here is the site picture for your shift.</p></div><div class="weather"><v-icon icon="mdi-weather-partly-cloudy" size="26" /><strong>68°</strong><span>Clear</span></div></section>
          <button class="report-cta" type="button" @click="openReport"><span class="cta-icon"><v-icon icon="mdi-camera-plus-outline" size="29" /></span><span class="cta-copy"><strong>Report incident</strong><small>Photo, note, and severity in under a minute</small></span><v-icon icon="mdi-arrow-right" size="25" /></button>
          <div v-if="savedNotice" class="saved-banner"><v-icon icon="mdi-check-circle" size="22" /><span><strong>Incident saved locally.</strong> It will send when connected.</span><button type="button" aria-label="Dismiss" @click="savedNotice = false"><v-icon icon="mdi-close" /></button></div>

          <section class="stat-grid" aria-label="Daily overview"><article class="stat-card"><span class="stat-icon teal"><v-icon icon="mdi-account-check-outline" /></span><strong>{{ checkedInCount }}/{{ data.crew.length }}</strong><span>Crew checked in</span><small>One still expected</small></article><article class="stat-card"><span class="stat-icon amber"><v-icon icon="mdi-clipboard-check-outline" /></span><strong>{{ checklistCount }}/{{ checklist.length }}</strong><span>Safety checks</span><small>Keep the momentum</small></article><article class="stat-card"><span class="stat-icon coral"><v-icon icon="mdi-alert-outline" /></span><strong>{{ data.incidents.length }}</strong><span>Incidents today</span><small>Review before lunch</small></article></section>

          <div class="section-heading checklist-heading"><div><p class="eyebrow">Shift readiness</p><h3>Safety checklist</h3></div><span class="progress-label">{{ checklistCount }}/{{ checklist.length }}</span></div>
          <section class="checklist-list"><button v-for="(item, index) in checklist" :key="item.item" class="check-row" :class="{ complete: item.completed }" type="button" @click="toggleChecklist(index)"><span class="check-box"><v-icon v-if="item.completed" icon="mdi-check" size="18" /></span><span>{{ item.item }}</span><v-icon :icon="item.completed ? 'mdi-check-circle-outline' : 'mdi-circle-outline'" class="check-status" /></button></section>

          <div class="section-heading incidents-heading"><div><p class="eyebrow">Latest activity</p><h3>Today's incidents</h3></div><button type="button" class="text-button" @click="navigateTo('incidents')">View all <v-icon icon="mdi-arrow-right" size="17" /></button></div>
          <section class="incident-list"><article v-for="incident in data.incidents" :key="incident.id" class="incident-row"><div class="severity-bar" :class="incident.severity.toLowerCase()" /><div class="incident-content"><div class="incident-meta"><span class="severity-tag" :class="incident.severity.toLowerCase()">{{ incident.severity }}</span><span>{{ formatTime(incident.timestamp) }}</span></div><strong>{{ incident.type }}</strong><p>{{ incident.note }}</p><small><v-icon icon="mdi-account-outline" size="14" /> {{ incident.reportedBy }} <span class="sync-label"><v-icon icon="mdi-cloud-check-outline" size="14" /> Synced</span></small></div><v-icon icon="mdi-chevron-right" class="row-chevron" /></article></section>

          <section class="insight-panel"><div><p class="eyebrow">Pattern watch</p><h3>Incidents by severity</h3><p class="muted">Two observations logged this shift.</p></div><div class="bar-chart"><div v-for="bar in incidentsBySeverity" :key="bar.label" class="bar-item"><span class="bar-value">{{ bar.count }}</span><div class="bar-track"><div class="bar-fill" :class="bar.color" :style="{ height: `${Math.max(bar.count * 34, 5)}px` }" /></div><small>{{ bar.label }}</small></div></div></section>
        </main>

        <main v-else-if="currentPage === 'incidents'" class="content page-content">
          <section class="page-intro"><button class="back-button" type="button" @click="navigateTo('today')"><v-icon icon="mdi-arrow-left" size="19" /> Back to today</button><p class="eyebrow">Safety record</p><h2>All incidents</h2><p class="muted">A clear record of every issue reported on this site.</p></section>
          <section class="filter-row" aria-label="Incident filters"><button class="filter-chip active" type="button">All <span>{{ data.incidents.length }}</span></button><button class="filter-chip" type="button">High priority</button><button class="filter-chip" type="button">Needs review</button></section>
          <section class="incident-list full-list"><article v-for="incident in data.incidents" :key="incident.id" class="incident-row"><div class="severity-bar" :class="incident.severity.toLowerCase()" /><div class="incident-content"><div class="incident-meta"><span class="severity-tag" :class="incident.severity.toLowerCase()">{{ incident.severity }}</span><span>{{ formatTime(incident.timestamp) }}</span></div><strong>{{ incident.type }}</strong><p>{{ incident.note }}</p><small><v-icon icon="mdi-account-outline" size="14" /> {{ incident.reportedBy }} <span class="sync-label"><v-icon icon="mdi-cloud-check-outline" size="14" /> Synced</span></small></div><v-icon icon="mdi-chevron-right" class="row-chevron" /></article></section>
          <button class="report-cta page-report" type="button" @click="openReport"><span class="cta-icon"><v-icon icon="mdi-camera-plus-outline" size="29" /></span><span class="cta-copy"><strong>Report another incident</strong><small>Capture a new issue from the field</small></span><v-icon icon="mdi-arrow-right" size="25" /></button>
        </main>

        <main v-else-if="currentPage === 'crew'" class="content page-content">
          <section class="page-intro"><p class="eyebrow">People on site</p><h2>Crew check-in</h2><p class="muted">Know who is accounted for before the next walk-through.</p></section>
          <section class="crew-summary"><div><strong>{{ checkedInCount }}/{{ data.crew.length }}</strong><span>checked in</span></div><div class="crew-progress"><div :style="{ width: `${(checkedInCount / data.crew.length) * 100}%` }" /></div><p>{{ data.crew.length - checkedInCount }} person still expected today.</p></section>
          <section class="crew-list"><article v-for="person in data.crew" :key="person.name" class="crew-row"><span class="avatar">{{ person.name.split(' ').map((part) => part[0]).join('') }}</span><div class="crew-details"><strong>{{ person.name }}</strong><span>{{ person.role }}</span></div><div class="crew-status" :class="{ checked: person.checkedIn }"><v-icon :icon="person.checkedIn ? 'mdi-check-circle' : 'mdi-clock-outline'" size="20" /><span>{{ person.checkedIn ? person.checkInTime : 'Expected' }}</span></div></article></section>
        </main>

        <main v-else class="content page-content">
          <section class="page-intro"><p class="eyebrow">Site tools</p><h2>More</h2><p class="muted">Quick access to settings and field support.</p></section>
          <section class="more-list"><button class="more-row" type="button" @click="glareMode = !glareMode"><span class="more-icon amber"><v-icon icon="mdi-white-balance-sunny" /></span><span><strong>Display mode</strong><small>{{ glareMode ? 'Glare mode is on' : 'Normal mode' }}</small></span><span class="more-value">{{ glareMode ? 'Glare' : 'Normal' }} <v-icon icon="mdi-chevron-right" size="20" /></span></button><button class="more-row" type="button"><span class="more-icon teal"><v-icon icon="mdi-cloud-check-outline" /></span><span><strong>Sync status</strong><small>All reports are up to date</small></span><span class="more-value status-good">Connected <v-icon icon="mdi-check-circle-outline" size="20" /></span></button><button class="more-row" type="button"><span class="more-icon slate"><v-icon icon="mdi-help-circle-outline" /></span><span><strong>Field help</strong><small>Quick guidance for incident reporting</small></span><v-icon icon="mdi-chevron-right" size="20" class="more-chevron" /></button></section>
          <section class="about-panel"><v-icon icon="mdi-hard-hat" size="25" /><div><strong>Riverside build site</strong><p>Site safety workspace · Shift 07:00–17:00</p></div></section>
        </main>

        <nav class="bottom-nav" aria-label="Primary navigation"><button :class="{ active: currentPage === 'today' }" type="button" @click="navigateTo('today')"><v-icon icon="mdi-view-dashboard-outline" /><span>Today</span></button><button type="button" @click="openReport"><v-icon icon="mdi-plus-circle-outline" /><span>Report</span></button><button :class="{ active: currentPage === 'crew' }" type="button" @click="navigateTo('crew')"><v-icon icon="mdi-account-group-outline" /><span>Crew</span></button><button :class="{ active: currentPage === 'more' }" type="button" @click="navigateTo('more')"><v-icon icon="mdi-menu" /><span>More</span></button></nav>

        <v-dialog v-model="reportOpen" fullscreen transition="dialog-bottom-transition" scrim="rgba(16, 35, 38, .64)"><div class="report-sheet" :class="{ 'glare-mode': glareMode }"><div class="sheet-header"><button type="button" aria-label="Close report" class="icon-button" @click="reportOpen = false"><v-icon icon="mdi-close" /></button><div><p class="eyebrow">Quick capture</p><h2>Report an incident</h2></div><span class="step-count">1 of 1</span></div><div class="capture-area"><v-icon icon="mdi-camera-outline" size="44" /><strong>Add a site photo</strong><span>Make the issue easy to find later.</span><button type="button" class="photo-button"><v-icon icon="mdi-camera" /> Take photo</button></div><div class="sheet-fields"><label class="field-label">What happened?</label><div class="choice-grid type-grid"><button v-for="type in ['Hazard', 'Near Miss', 'Injury', 'Property Damage', 'Equipment Failure']" :key="type" type="button" :class="{ selected: selectedType === type }" @click="selectedType = type">{{ type }}</button></div><label class="field-label">How serious is it?</label><div class="choice-grid severity-grid"><button v-for="severity in ['Low', 'Medium', 'High', 'Critical'] as Severity[]" :key="severity" type="button" :class="[severity.toLowerCase(), { selected: selectedSeverity === severity }]" @click="selectedSeverity = severity">{{ severity }}</button></div><label class="field-label" for="note">Add a short note <span>Optional</span></label><textarea id="note" v-model="note" rows="3" placeholder="What should the next person know?" /></div><div class="sheet-footer"><div class="offline-note"><v-icon icon="mdi-cloud-off-outline" /><span>Saved locally first<br /><small>Will sync when connected</small></span></div><button type="button" class="save-button" @click="saveReport">Save incident <v-icon icon="mdi-arrow-right" /></button></div></div></v-dialog>
      </div>
    </v-main>
  </v-app>
</template>
