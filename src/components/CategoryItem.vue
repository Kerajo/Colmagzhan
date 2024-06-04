<script setup>
import { defineProps, computed } from 'vue'
import { RouterLink } from 'vue-router'
import IconFolder from './icons/IconFolder.vue'
import IconFile from './icons/IconFile.vue'

const props = defineProps({
  itemType: String,
  categoryId: Number,
  currentPath: String,
  item: Object
})

const path = computed(() => {
  if (props.itemType === 'folder') {
    return `/category/${props.categoryId}/${props.currentPath ? props.currentPath + '/' : ''}${encodeURIComponent(props.item.name)}?id=${encodeURIComponent(props.item.id)}`
  } else {
    return `/category/${props.categoryId}/${props.currentPath ? props.currentPath + '/' : ''}file/${encodeURIComponent(props.item.name)}??id=${encodeURIComponent(props.item.id)}`
  }
})
</script>

<template>
  <RouterLink :to="path" class="list__item">
    <div v-if="itemType === 'folder'" class="list__folder folder">
      <IconFolder />
      <span class="folder__name">{{ props.item.name }}</span>
    </div>
    <div v-if="itemType === 'file'" class="list__file file">
      <div class="file__left">
        <IconFile />
        <span class="file__name">{{ props.item.name }}</span>
      </div>
      <div class="file__right">
        <span class="file__info file__date">{{ props.item.fileDate }}</span>
        <span class="file__info file__type">{{ props.item.fileType }}</span>
        <span class="file__info file__size">{{ props.item.fileSize }}</span>
      </div>
    </div>
  </RouterLink>
</template>
