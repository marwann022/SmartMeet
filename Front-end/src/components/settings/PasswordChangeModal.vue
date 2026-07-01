<template>
  <Modal :show="show" title="Update Password" maxWidth="md" @close="handleClose">
    <form class="flex flex-col gap-5 text-left" @submit.prevent="submitPassword">
      <div class="rounded-2xl border border-primary/10 bg-primary/[0.04] p-4">
        <div class="flex items-start gap-3">
          <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PhShieldCheck :size="20" weight="bold" />
          </div>
          <div>
            <p class="font-header text-sm font-bold text-brand-dark">Keep your account secure</p>
            <p class="mt-1 font-body text-xs leading-relaxed text-brand-slate">
              Use at least 8 characters. A mix of letters, numbers, and symbols is recommended.
            </p>
          </div>
        </div>
      </div>

      <PasswordField
        v-model="form.currentPassword"
        label="Current Password"
        :visible="visible.current"
        :error="fieldError('currentPassword')"
        autocomplete="current-password"
        @toggle="visible.current = !visible.current"
        @blur="touchField('currentPassword')"
      />

      <PasswordField
        v-model="form.newPassword"
        label="New Password"
        :visible="visible.new"
        :error="fieldError('newPassword')"
        autocomplete="new-password"
        @toggle="visible.new = !visible.new"
        @blur="touchField('newPassword')"
      />
      <div class="text-xs space-y-1 text-brand-slate">
  <p :class="/[a-z]/.test(form.newPassword) ? 'text-green-600' : ''">
    ✓ Lowercase letter
  </p>

  <p :class="/[A-Z]/.test(form.newPassword) ? 'text-green-600' : ''">
    ✓ Uppercase letter
  </p>

  <p :class="/[0-9]/.test(form.newPassword) ? 'text-green-600' : ''">
    ✓ Number
  </p>

  <p :class="/[^a-zA-Z0-9]/.test(form.newPassword) ? 'text-green-600' : ''">
    ✓ Special character
  </p>

  <p :class="form.newPassword.length >= 8 ? 'text-green-600' : ''">
    ✓ 8+ characters
  </p>
</div>

      <PasswordField
        v-model="form.confirmPassword"
        label="Confirm New Password"
        :visible="visible.confirm"
        :error="fieldError('confirmPassword')"
        autocomplete="new-password"
        @toggle="visible.confirm = !visible.confirm"
        @blur="touchField('confirmPassword')"
      />

      <div class="flex flex-col-reverse gap-3 border-t border-black/5 dark:border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          class="rounded-xl border border-black/8 dark:border-white/10 bg-white dark:bg-slate-900 px-5 py-2.5 font-header text-xs font-bold text-brand-dark transition-all hover:bg-black/5 dark:hover:bg-white/5"
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-grad-primary px-6 py-3 font-header text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_15px_rgba(75,104,255,0.2)] transition-all hover:shadow-[0_6px_22px_rgba(75,104,255,0.3)] disabled:pointer-events-none disabled:opacity-50"
          :disabled="!canSubmit || isSaving"
        >
          <span v-if="isSaving" class="h-3.5 w-3.5 animate-spinner rounded-full border-2 border-white/40 border-t-white"></span>
          {{ isSaving ? 'Saving...' : 'Save Password' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { computed, defineComponent, h, reactive, ref, watch } from 'vue'
import { PhEye, PhEyeSlash, PhShieldCheck } from '@phosphor-icons/vue'
import Modal from '../ui/Modal.vue'
import { useToasts } from '../../composables/useToasts'
import axios from "axios"

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const { success, error, info } = useToasts()

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const touched = reactive({
  currentPassword: false,
  newPassword: false,
  confirmPassword: false
})

const visible = reactive({
  current: false,
  new: false,
  confirm: false
})

const submitted = ref(false)
const isSaving = ref(false)

const resetForm = () => {
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
  touched.currentPassword = false
  touched.newPassword = false
  touched.confirmPassword = false
  visible.current = false
  visible.new = false
  visible.confirm = false
  submitted.value = false
  isSaving.value = false
}

watch(
  () => props.show,
  (isShown) => {
    if (!isShown) {
      resetForm()
    }
  }
)

const validation = computed(() => ({
  currentPassword: !form.currentPassword
  ? 'Current password is required.'
  : '',
  newPassword: !form.newPassword
  ? 'New password is required.'
  : !/[a-z]/.test(form.newPassword)
    ? 'Must contain a lowercase letter.'
    : !/[A-Z]/.test(form.newPassword)
      ? 'Must contain an uppercase letter.'
      : !/[0-9]/.test(form.newPassword)
        ? 'Must contain a number.'
        : !/[^a-zA-Z0-9]/.test(form.newPassword)
          ? 'Must contain a special character.'
          : form.newPassword.length < 8
            ? 'Password must be at least 8 characters.'
            : '',

  confirmPassword: !form.confirmPassword
    ? 'Please confirm the new password.'
    : form.confirmPassword !== form.newPassword
      ? 'Passwords do not match.'
      : ''
}))

const canSubmit = computed(() => Object.values(validation.value).every((message) => !message))

const touchField = (field) => {
  touched[field] = true
}

const fieldError = (field) => {
  if (!touched[field] && !submitted.value) return ''
  return validation.value[field]
}

const handleClose = () => {
  if (!isSaving.value) emit('close')
}

const submitPassword = async () => {

  submitted.value = true;

  if (!canSubmit.value) {

    const message =
      validation.value.confirmPassword ||
      validation.value.currentPassword ||
      validation.value.newPassword ||
      "Validation failed";

    error(message);

    return;
  }

  try {

    isSaving.value = true;

    const token =
      localStorage.getItem("token");

    await axios.put(
      "http://localhost:5000/api/users/change-password",
      {
        currentPassword:
          form.currentPassword,

        newPassword:
          form.newPassword
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    success(
      "Password updated successfully"
    );

    emit("updated");

    emit("close");

  } catch (err) {

    error(
      err.response?.data?.message ||
      "Failed to update password"
    );

  } finally {

    isSaving.value = false;

  }
};

const PasswordField = defineComponent({
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, required: true },
    visible: { type: Boolean, default: false },
    error: { type: String, default: '' },
    autocomplete: { type: String, default: 'off' }
  },
  emits: ['update:modelValue', 'toggle', 'blur'],
  setup(fieldProps, { emit: fieldEmit }) {
    return () => h('div', { class: 'flex flex-col gap-1.5' }, [
      h('label', { class: 'font-header text-[11px] font-semibold text-brand-slate tracking-wide ml-1' }, fieldProps.label),
      h('div', { class: 'relative' }, [
        h('input', {
          value: fieldProps.modelValue,
          type: fieldProps.visible ? 'text' : 'password',
          autocomplete: fieldProps.autocomplete,
          class: [
            'w-full rounded-xl border bg-white dark:bg-slate-950/60 px-4 py-3 pr-12 font-body text-sm text-brand-dark transition-all placeholder-brand-slate/40 focus:outline-none',
            fieldProps.error
              ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
              : 'border-black/8 dark:border-white/10 focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)]'
          ],
          onInput: (event) => fieldEmit('update:modelValue', event.target.value),
          onBlur: () => fieldEmit('blur')
        }),
        h('button', {
          type: 'button',
          class: 'absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-brand-slate transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary',
          'aria-label': fieldProps.visible ? 'Hide password' : 'Show password',
          onClick: () => fieldEmit('toggle')
        }, [
          h(fieldProps.visible ? PhEyeSlash : PhEye, { size: 18, weight: 'bold' })
        ])
      ]),
      fieldProps.error
        ? h('p', { class: 'ml-1 font-body text-[11px] font-semibold text-red-500' }, fieldProps.error)
        : null
    ])
  }
})
</script>
