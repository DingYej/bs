<template>
<div class="kl">
    <echarts />
</div>
</template>

<script>
import echarts from "@/components/echarts"
export default {
    name: "CourseStatistic",
    data() {
        return {

        };
    },
    components: {
        echarts
    }
};
</script>

<style>
.kl {
    width: 100%;
}
</style>
