<template>
    <div class="flex gap-2 p-2 items-center border-b mb-2">
        <img class="h-14 md:h-16 " :src="applogo" alt="logo_company">
        <div>
            <n-p>
                <b>{{apptitle}}</b><br />
                <!-- <p class="text-xs capitalize">
                    {{ props.cabang }}
                </p> -->
                <p class="text-xs capitalize">
                    {{ props.alamat_cabang }}
                </p>
            </n-p>
        </div>
    </div>
</template>
<script setup>
const apptitle = import.meta.env.VITE_APP_TITLE;
const applogo = import.meta.env.VITE_APP_LOGO;
const props=defineProps({
    alamat_cabang: {
        type:String,
        default: "JL.BY PASS KANDANGHAUR DEPAN KANTOR PLN BLOK ANJUN DS.KARANGANYAR KEC.KANDANHAUR KAB.INDRAMAYU KARANGANYAR KANDANGHAUR INDRAMAYU",
    },
    cabang:String,
});
</script>
