import Vue from 'vue';
import axios from 'axios';
import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import * as All from 'quasar';
import INDEX from 'src/pages/Index.vue';
// import langEn from 'quasar/lang/en-us'
// change to any language you wish! => this breaks wallaby :(
const { Quasar } = All;

Vue.prototype.$axios = axios;

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key];
  if (val && val.component && val.component.name != null) {
    object[key] = val;
  }

  return object;
}, {});

describe('Index page', () => {
  const localVue = createLocalVue();

  localVue.use(Quasar, { components }); // , lang: langEn

  const wrapper = shallowMount(INDEX, {
    localVue,
  });

  const { vm } = wrapper;

  it('has a created hook', () => {
    expect(typeof vm.submit).toBe('function');
  });

  it('accesses the shallowMount', () => {
    expect(vm.$el.textContent).toContain('Calendar');
    expect(wrapper.text()).toContain('Calendar'); // easier
    expect(wrapper.find('div.text-h6').text()).toContain('Calendar');
  });

  it('has correct days', () => {
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
