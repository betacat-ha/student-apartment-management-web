<template>
    <div style="height: 400px">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2
            :columns="columns"
            :cell-props="cellProps"
            :class="kls"
            :data="data"
            :width="width"
            :height="height"
          />
        </template>
      </el-auto-resizer>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import axios from 'axios'

  const columns = [{
    align: 'center',
    title: '学号'
  },
{
  align: 'center',
  with: 200,
  title: '姓名'
},
{
  align: 'center',
  with: 200,
  title: '电话'
}];
  const data = [];
  
  const cellProps = ({ columnIndex }) => {
    const key = `hovering-col-${columnIndex}`
    return {
      ['data-key']: key,
      onMouseenter: () => {
        kls.value = key
      },
      onMouseleave: () => {
        kls.value = ''
      },
    }
  }
  
  const kls = ref<string>('')
  </script>
  
  <style>
  .hovering-col-0 [data-key='hovering-col-0'],
  .hovering-col-1 [data-key='hovering-col-1'],
  .hovering-col-2 [data-key='hovering-col-2'],
  .hovering-col-3 [data-key='hovering-col-3'],
  .hovering-col-4 [data-key='hovering-col-4'],
  .hovering-col-5 [data-key='hovering-col-5'],
  .hovering-col-6 [data-key='hovering-col-6'],
  .hovering-col-7 [data-key='hovering-col-7'],
  .hovering-col-8 [data-key='hovering-col-8'],
  .hovering-col-9 [data-key='hovering-col-9'],
  .hovering-col-10 [data-key='hovering-col-10'] {
    background: var(--el-table-row-hover-bg-color);
  }
  
  [data-key='hovering-col-0'] {
    font-weight: bold;
    user-select: none;
    pointer-events: none;
  }
  </style>
  