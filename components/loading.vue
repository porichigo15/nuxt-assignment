<template>
    <v-overlay :value="loading">
        <v-progress-circular indeterminate color="secondary"/>
    </v-overlay>
</template>

<script>
    export default {
        name: "Loading",
        props: {
            loading: Boolean
        }
    }
</script>