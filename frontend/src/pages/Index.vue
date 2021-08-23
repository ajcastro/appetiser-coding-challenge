<template>
  <q-page class="flex flex-center bg-grey-3 q-pa-lg">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">
          Calendar
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row q-col-gutter-lg">
        <div class="col-xs-12 col-md-4">
          <q-form
            class="row q-col-gutter-md"
            @submit="submit"
            greedy
          >
            <q-input
              v-model="event.title"
              class="col-12"
              label="Event *"
              stack-label
              outlined
              dense
              hide-bottom-space
              :rules="[val => !!val || 'Event field is required.']"
            >
              <template #append>
                <q-icon name="map" />
              </template>
            </q-input>
            <q-input
              v-model="event.from"
              class="col-12 col-sm-6"
              label="From *"
              stack-label
              outlined
              dense
              type="date"
              hide-bottom-space
              :rules="[val => !!val || 'From field is required.']"
            />
            <q-input
              v-model="event.to"
              class="col-12 col-sm-6"
              label="To *"
              stack-label
              outlined
              dense
              type="date"
              hide-bottom-space
              :rules="[val => !!val || 'To field is required.']"
            />
            <div class="col-12">
              <q-checkbox
                v-for="day in days"
                v-model="event.days"
                :key="day.value"
                :val="day.value"
                :label="day.label"
              />
            </div>
            <div class="col-12">
              <q-btn
                type="submit"
                label="Save"
                no-caps
                color="primary"
                :loading="saving"
              />
            </div>
            <div
              class="col-12 text-italic text-grey"
              style="font-size: 12px;"
            >
              * Indicates required fields.
            </div>
          </q-form>
        </div>
        <div
          v-if="!showCalendar"
          class="col-xs-12 col-md-8"
        >
          <div class="bg-info q-pa-lg rounded-borders text-white">
            Please select date range.
          </div>
        </div>
        <div class="col-xs-12 col-md">
          <div
            v-for="(cal, calIndex) in calendar"
            :key="calIndex"
          >
            <div class="text-h6">
              {{ cal.month }}
            </div>
            <q-list
              bordered
              separator
            >
              <q-item
                v-for="calDate in cal.dates"
                :key="calDate.dayOfMonth"
                :class="{ 'bg-green-2': savedEvent.days.includes(calDate.dayOfWeek)}"
              >
                <q-item-section class="col-2">
                  {{ calDate.dayOfMonth }}
                  {{ calDate.dayOfWeekText }}
                </q-item-section>
                <q-item-section v-if="savedEvent.days.includes(calDate.dayOfWeek)">
                  {{ savedEvent.title }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { date } from 'quasar';

const daysOfWeek = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
];

export default {
  async created() {
    this.$axios.defaults.baseURL = process.env.API_URL;
  },
  computed: {
    showCalendar() {
      return this.event.from && this.event.to;
    },
    calendar() {
      if (!this.showCalendar) {
        return [];
      }

      const from = new Date(this.event.from);
      const to = new Date(this.event.to);
      let cursor = new Date(this.event.from);
      const calendar = {
        // 6 : {
        //   month: 'June',
        //   dates: [
        //     {date: '2021-06-01', dayOfWeek: 1, dayOfWeekText: 'Mon', dayOfMonth: 1},
        //     {date: '2021-06-02', dayOfWeek: 2, dayOfWeekText: 'Tue', dayOfMonth: 2},
        //     {date: '2021-06-03', dayOfWeek: 3, dayOfWeekText: 'Wed', dayOfMonth: 3},
        //   ],
        // }
      };

      while (date.isBetweenDates(cursor, from, to, {
        inclusiveFrom: true,
        inclusiveTo: true,
        onlyDate: true,
      })) {
        const month = cursor.getMonth();

        calendar[month] = calendar[month] || {
          month: `${cursor.toLocaleString('default', { month: 'long' })} ${cursor.getFullYear()}`,
          dates: [],
        };

        calendar[month].dates.push({
          date: cursor,
          dayOfMonth: cursor.getDate(),
          dayOfWeek: cursor.getDay(),
          dayOfWeekText: daysOfWeek[cursor.getDay()],
        });

        cursor = date.addToDate(cursor, { days: 1 });
      }

      return calendar;
    },
  },
  data() {
    return {
      saving: false,
      event: {
        title: '',
        from: null,
        to: null,
        days: [],
      },
      savedEvent: {
        title: '',
        from: null,
        to: null,
        days: [],
      },
      days: [
        { label: 'Mon', value: 1 },
        { label: 'Tue', value: 2 },
        { label: 'Wed', value: 3 },
        { label: 'Thu', value: 4 },
        { label: 'Fri', value: 5 },
        { label: 'Sat', value: 6 },
        { label: 'Sun', value: 0 },
      ],
    };
  },
  methods: {
    async submit() {
      this.savedEvent = { ...await this.saveEvent(this.event) };
      this.$q.notify({
        color: 'positive',
        icon: 'check',
        position: 'top-right',
        message: 'Event successfully saved',
      });
    },
    async saveEvent(event) {
      this.saving = true;
      const { data } = await this.$axios.post('api/events', event);
      this.saving = false;

      return data;
    },
  },
};
</script>

<style>
  .my-card {
    min-height: 85vh;
    width: 100%;
  }
</style>
