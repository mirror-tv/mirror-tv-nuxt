<template>
  <div>
    <ClientOnly>
      <GptAd
        :adUnit="'mirror_pc_hp_970x250_HD'"
        :adSize="[
          [970, 250],
          [970, 90],
          [1, 1],
        ]"
        v-on="$listeners"
      />
      <p>測試</p>
      <p>測試</p>
      <p>測試</p>
      <p>測試</p>
      <p>測試</p>
      <p>測試</p>
      <p>測試</p>
      <p>測試</p>
      <p>測試</p>
      <p>測試</p>
      <GptAd
        :adUnit="'mirror_RWD_ros_110x50_logo'"
        :adSize="[
          [95, 50],
          [1, 1],
        ]"
        v-on="$listeners"
      />
    </ClientOnly>
  </div>
</template>

<script>
export default {}
</script>
