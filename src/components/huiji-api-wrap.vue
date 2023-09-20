<template>
  <n-message-provider>
    <n-dialog-provider>
      <n-loading-bar-provider>
        <n-notification-provider>
          <use-huiji-api />
          <slot></slot>
        </n-notification-provider>
      </n-loading-bar-provider>
    </n-dialog-provider>
  </n-message-provider>
</template>
