import Vue from 'vue';
import axios from 'axios';
import {
  mountFactory,
  qLayoutInjections,
} from '@quasar/quasar-app-extension-testing-unit-jest';
import IndexComponent from 'src/pages/Index.vue';
import * as All from 'quasar';

Vue.prototype.$axios = axios;

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key];
  if (val && val.component && val.component.name != null) {
    object[key] = val;
  }
  return object;
}, {});

const factory = mountFactory(IndexComponent, {
  mount: {
    type: 'full',
    provide: qLayoutInjections(),
  },
  quasar: {
    components,
  },
});

describe('Index page', () => {
  const wrapper = factory();
  const { vm } = wrapper;

  test('mounts without errors', () => {
    expect(wrapper).toBeTruthy();
  });

  test('has a submit function', () => {
    expect(typeof vm.submit).toBe('function');
  });

  test('displays Calender heading', () => {
    expect(vm.$el.textContent).toContain('Calendar');
    expect(wrapper.text()).toContain('Calendar'); // easier
    expect(wrapper.find('div.text-h6').text()).toContain('Calendar');
  });

  test('has correct days', () => {
    const days = [
      { label: 'Mon', value: 1 },
      { label: 'Tue', value: 2 },
      { label: 'Wed', value: 3 },
      { label: 'Thu', value: 4 },
      { label: 'Fri', value: 5 },
      { label: 'Sat', value: 6 },
      { label: 'Sun', value: 0 },
    ];
    expect(vm.days).toStrictEqual(days);
  });
});
